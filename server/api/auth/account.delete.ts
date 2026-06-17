import { eq } from "drizzle-orm";
import { sessionTable, userTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const sessionId = getCookie(event, "session_id");

  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: "Utilizator neautentificat..",
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

  if (!row) {
    deleteCookie(event, "session_id");

    throw createError({
      statusCode: 401,
      message: "Session invalid.",
    });
  }

  if (row.user.role === "admin") {
    throw createError({
      statusCode: 403,
      message: "Admin accounts cannot be deleted from this endpoint.",
    });
  }

  await db.delete(userTable).where(eq(userTable.id, row.user.id));

  deleteCookie(event, "session_id");

  return {
    success: true,
    message: "Cont șters cu succes.",
  };
});
