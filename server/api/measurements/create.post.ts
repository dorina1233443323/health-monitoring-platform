import {
  userTable,
  sessionTable,
  measurementsTable,
  patientProfileTable,
} from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const sessionId = getCookie(event, "session_id");
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: "Utilizator neautentificat.",
    });
  }
  const { type, value, unit, measuredAt } = await readBody(event);
  if (!type || !value || !unit || !measuredAt) {
    throw createError({
      statusCode: 400,
      message: "All the data must be provided in data body.",
    });
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
    throw createError({ statusCode: 401, message: "Session invalid." });
  }

  const user = row.user;

  const profiles = await db
    .select()
    .from(patientProfileTable)
    .where(eq(patientProfileTable.userId, user.id))
    .limit(1);

  const patientProfile = profiles[0];

  if (!patientProfile) {
    throw createError({
      statusCode: 404,
      message: "Profilul pacientului nu a fost găsit.",
    });
  }

  const insertedMeasurement = await db
    .insert(measurementsTable)
    .values({
      patientId: patientProfile.id,
      type: type,
      value: Number(value),
      unit: unit,
      measuredAt: measuredAt,
      createdAt: new Date().toISOString(),
    })
    .returning();

  return {
    measurement: insertedMeasurement[0],
  };
});
