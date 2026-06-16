import { eq } from "drizzle-orm";
import {
  measurementsTable,
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
    .where(eq(patientProfileTable.userId, row.user.id))
    .limit(1);

  const patientProfile = profiles[0];

  if (!patientProfile) {
    throw createError({
      statusCode: 404,
      message: "Patient profile not found.",
    });
  }

  const measurements = await db
    .select()
    .from(measurementsTable)
    .where(eq(measurementsTable.id, id))
    .limit(1);

  const measurement = measurements[0];

  if (!measurement) {
    throw createError({
      statusCode: 404,
      message: "Measurement not found.",
    });
  }

  if (measurement.patientId !== patientProfile.id) {
    throw createError({
      statusCode: 403,
      message: "Access denied.",
    });
  }

  await db.delete(measurementsTable).where(eq(measurementsTable.id, id));

  return {
    success: true,
    message: "Measurement deleted successfully.",
  };
});
