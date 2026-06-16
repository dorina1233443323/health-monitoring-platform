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

  if (!row) {
    throw createError({ statusCode: 401, message: "Invalid session" });
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

  const healthGoals = await db
    .select()
    .from(healthGoalsTable)
    .where(eq(healthGoalsTable.patientId, patientProfile.id));

  return healthGoals;;
});
