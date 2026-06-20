import { eq } from "drizzle-orm";
import { sessionTable, userTable } from "~~/server/db/schema";

export async function getCurrentUser(event: any) {
  const sessionId = getCookie(event, "session_id");

  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: "Utilizator neautentificat.",
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

    throw createError({
      statusCode: 401,
      message: "Sesiune invalidă.",
    });
  }

  return row.user;
}
