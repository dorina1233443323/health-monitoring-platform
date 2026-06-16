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
    throw createError({ statusCode: 401, message: "User not authenticated" });
  }
  const { type, targetValue, unit, startDate, endDate, status } =
    await readBody(event);
  if (
    !type ||
    targetValue === undefined ||
    !unit ||
    !startDate ||
    !endDate ||
    !status
  ) {
    throw createError({
      statusCode: 400,
      message: "All the data must be provided in data body.",
    });
  }

  if (!["active", "completed", "cancelled"].includes(status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid goal status.",
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
      message: "Patient profile not found.",
    });
  }

  const insertedGoal = await db
    .insert(healthGoalsTable)
    .values({
      patientId: patientProfile.id,
      type: type,
      targetValue: Number(targetValue),
      unit: unit,
      startDate: startDate,
      endDate: endDate,
      status: status,
      createdAt: new Date().toISOString(),
    })
    .returning();

  return {
    goal: insertedGoal[0],
  };
});
