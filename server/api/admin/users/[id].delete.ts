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

  const id = Number(getRouterParam(event, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      message: "Id invalid.",
    });
  }

  const db = useDrizzle();

  const rows = await db
    .select({
      user: userTable,
      session: sessionTable,
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
      message: "Sesiune invalidă.",
    });
  }

  const user = row.user;

  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Access denied.",
    });
  }

  if (user.id === id) {
    throw createError({
      statusCode: 400,
      message: "Nu îti poți șterge contul de administrator.",
    });
  }

  const targetUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  if (!targetUser[0]) {
    throw createError({
      statusCode: 404,
      message: "User not found.",
    });
  }

  await db.delete(userTable).where(eq(userTable.id, id));

  return {
    success: true,
    message: "User deleted successfully.",
  };
});
