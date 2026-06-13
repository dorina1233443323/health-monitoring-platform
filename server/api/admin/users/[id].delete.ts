import { eq } from "drizzle-orm";
import { sessionTable, userTable } from "~~/server/db/schema";

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
    throw createError({ statusCode: 401, message: "Invalid session" });
  }
  const user = row.user;

  if (user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Access denied." });
  }
  if (user.id === id) {
    throw createError({
      statusCode: 400,
      message: "You cannot delete your own account from the admin panel.",
    });
  }

  await db.delete(userTable).where(eq(userTable.id, id));

  return {
    success: true,
    message: "User deleted successfully.",
  };
});
