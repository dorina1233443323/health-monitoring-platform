import {
  userTable,
  sessionTable,
  patientProfileTable,
  healthGoalsTable,
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

  const db = useDrizzle();

  const result = await db
    .select({
      user: userTable,
      session: sessionTable,
    })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId))
    .limit(1);

  const row = result[0];

  if (!row || new Date(row.session.expiresAt) < new Date()) {
    deleteCookie(event, "session_id");

    throw createError({
      statusCode: 401,
      message: "Sesiune invalidă.",
    });
  }

  const profiles = await db
    .select()
    .from(patientProfileTable)
    .where(eq(patientProfileTable.userId, row.user.id))
    .limit(1);

  const patientProfile = profiles[0];

  if (!patientProfile) {
    return [];
  }

  const healthGoals = await db
    .select({
      id: healthGoalsTable.id,
      patientId: healthGoalsTable.patientId,
      type: healthGoalsTable.type,
      targetValue: healthGoalsTable.targetValue,
      startValue: healthGoalsTable.startValue,
      unit: healthGoalsTable.unit,
      direction: healthGoalsTable.direction,
      startDate: healthGoalsTable.startDate,
      endDate: healthGoalsTable.endDate,
      status: healthGoalsTable.status,
      createdAt: healthGoalsTable.createdAt,
    })
    .from(healthGoalsTable)
    .where(eq(healthGoalsTable.patientId, patientProfile.id));

  return healthGoals;
});
