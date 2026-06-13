import { userTable, sessionTable } from "~~/server/db/schema";
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
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
});