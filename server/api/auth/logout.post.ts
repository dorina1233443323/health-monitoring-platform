import { eq } from "drizzle-orm";
import { sessionTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const sessionId = getCookie(event, "session_id");

  if (sessionId) {
    const db = useDrizzle();
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
  }

  deleteCookie(event, "session_id");

  return { success: true, message: "Ieșire cu succes." };
});
