import { eq } from "drizzle-orm";
import {
  healthGoalsTable,
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

  const { type, targetValue, unit, startDate, endDate, status } =
    await readBody(event);

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

  const profiles = await db
    .select()
    .from(patientProfileTable)
    .where(eq(patientProfileTable.userId, row.user.id))
    .limit(1);

  const patientProfile = profiles[0];

  if (!patientProfile) {
    throw createError({
      statusCode: 404,
      message: "Profilul pacientului nu a fost găsit.",
    });
  }

  const goals = await db
    .select()
    .from(healthGoalsTable)
    .where(eq(healthGoalsTable.id, id))
    .limit(1);

  const goal = goals[0];

  if (!goal) {
    throw createError({
      statusCode: 404,
      message: "Măsura nu a fost găsită.",
    });
  }

  if (goal.patientId !== patientProfile.id) {
    throw createError({
      statusCode: 403,
      message: "Access denied.",
    });
  }

  const updatedGoal = await db
    .update(healthGoalsTable)
    .set({
      type: type ?? goal.type,
      targetValue:
        targetValue !== undefined ? Number(targetValue) : goal.targetValue,
      unit: unit ?? goal.unit,
      startDate: startDate ?? goal.startDate,
      endDate: endDate ?? goal.endDate,
      status: status ?? goal.status,
    })
    .where(eq(healthGoalsTable.id, id))
    .returning();

  return {
    measurement: updatedGoal[0],
  };
});
