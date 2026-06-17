import { eq } from "drizzle-orm";
import {
  patientProfileTable,
  sessionTable,
  userTable,
} from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const sessionId = getCookie(event, "session_id");

  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: "Utilizator neautentificat.",
    });
  }

  const id = Number(getRouterParam(event, "id"));

  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: "Id invalid." });
  }

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
    throw createError({ statusCode: 401, message: "Sesiune invalidă." });
  }

  const result = await db
    .select({
      id: patientProfileTable.id,
      birthDate: patientProfileTable.birthDate,
      phone: patientProfileTable.phone,
      address: patientProfileTable.address,
      emergencyContactName: patientProfileTable.emergencyContactName,
      emergencyContactPhone: patientProfileTable.emergencyContactPhone,
      userId: userTable.id,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      email: userTable.email,
    })
    .from(patientProfileTable)
    .innerJoin(userTable, eq(patientProfileTable.userId, userTable.id))
    .where(eq(patientProfileTable.id, id))
    .limit(1);

  const patient = result[0];

  if (!patient) {
    throw createError({ statusCode: 404, message: "Patient not found." });
  }

  if (row.user.role !== "admin" && patient.userId !== row.user.id) {
    throw createError({ statusCode: 403, message: "Access denied." });
  }

  return {
    patient,
  };
});
