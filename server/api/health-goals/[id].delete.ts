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
      message: "Profilul pacientuluui nu a fost găsit.",
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
      message: "Scopul nu a fost găsit.",
    });
  }

  if (goal.patientId !== patientProfile.id) {
    throw createError({
      statusCode: 403,
      message: "Access interzis.",
    });
  }

  await db.delete(healthGoalsTable).where(eq(healthGoalsTable.id, id));

  return {
    success: true,
    message: "Scop șters cu succes.",
  };
});
