import { userTable, sessionTable } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const sessionId = getCookie(event, "session_id");
  if (!sessionId) {
    throw createError({ statusCode: 401, message: "User not authenticated" });
  }
  const db = useDrizzle();
  const rows = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    throw createError({ statusCode: 401, message: "Session invalid." });
  }
  await db.delete(userTable).where(eq(userTable.id, row.userId));

  return {
    success: true,
    message: "Account deleted successfully.",
  };
});
