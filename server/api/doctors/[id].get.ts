import { eq } from "drizzle-orm";
import { doctorProfileTable, userTable } from "../../db/schema";

export default eventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: "Invalid id." });
  }

  const db = useDrizzle();

  const result = await db
    .select({
      id: doctorProfileTable.id,
      specialization: doctorProfileTable.specialization,
      phone: doctorProfileTable.phone,
      userId: userTable.id,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      email: userTable.email,
    })
    .from(doctorProfileTable)
    .innerJoin(userTable, eq(doctorProfileTable.userId, userTable.id))
    .where(eq(doctorProfileTable.id, id))
    .limit(1);

  const doctor = result[0];

  if (!doctor) {
    throw createError({ statusCode: 404, message: "Not found." });
  }

  return doctor;
});
