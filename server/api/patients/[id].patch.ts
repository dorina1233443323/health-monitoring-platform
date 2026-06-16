import { eq } from "drizzle-orm";
import {
  patientProfileTable,
  sessionTable,
  userTable,
} from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const sessionId = getCookie(event, "session_id");

  if (!sessionId) {
    throw createError({ statusCode: 401, message: "User not authenticated" });
  }

  const id = Number(getRouterParam(event, "id"));

  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: "Invalid id." });
  }

  const {
    birthDate,
    phone,
    address,
    emergencyContactName,
    emergencyContactPhone,
  } = await readBody(event);

  const db = useDrizzle();

  const rows = await db
    .select({
      session: sessionTable,
      user: userTable,
    })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId))
    .limit(1);

  const row = rows[0];

  if (!row || new Date(row.session.expiresAt) < new Date()) {
    deleteCookie(event, "session_id");
    throw createError({ statusCode: 401, message: "Invalid session." });
  }

  const profiles = await db
    .select()
    .from(patientProfileTable)
    .where(eq(patientProfileTable.id, id))
    .limit(1);

  const patientProfile = profiles[0];

  if (!patientProfile) {
    throw createError({
      statusCode: 404,
      message: "Patient profile not found.",
    });
  }

  if (row.user.role !== "admin" && patientProfile.userId !== row.user.id) {
    throw createError({
      statusCode: 403,
      message: "Access denied.",
    });
  }

  const updatedPatients = await db
    .update(patientProfileTable)
    .set({
      birthDate: birthDate ?? patientProfile.birthDate,
      phone: phone ?? patientProfile.phone,
      address: address ?? patientProfile.address,
      emergencyContactName:
        emergencyContactName ?? patientProfile.emergencyContactName,
      emergencyContactPhone:
        emergencyContactPhone ?? patientProfile.emergencyContactPhone,
    })
    .where(eq(patientProfileTable.id, id))
    .returning();

  return {
    patient: updatedPatients[0],
  };
});
