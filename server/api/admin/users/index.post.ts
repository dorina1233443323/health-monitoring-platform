import { userTable, sessionTable } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const sessionId = getCookie(event, "session_id");
  if (!sessionId) {
    throw createError({ statusCode: 401, message: "User not authenticated" });
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
  const users = await db
    .select({
      id: userTable.id,
      email: userTable.email,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      role: userTable.role,
      createdAt: userTable.createdAt,
      updatedAt: userTable.updatedAt,
    })
    .from(userTable);
  return users;
});
