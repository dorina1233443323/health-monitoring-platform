import { eq } from "drizzle-orm";
import { patientProfileTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const db = useDrizzle();

  const rows = await db
    .select()
    .from(patientProfileTable)
    .where(eq(patientProfileTable.userId, user.id))
    .limit(1);

  return rows[0] ?? null;
});
