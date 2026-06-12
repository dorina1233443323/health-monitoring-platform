import { eq } from "drizzle-orm";
import { patientProfileTable, userTable } from "../../db/schema";

export default eventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: "Invalid id." });
  }

  const db = useDrizzle();

  const result = await db
    .select({
      id: patientProfileTable.id,
      birthDate: patientProfileTable.birthDate,
      phone: patientProfileTable.phone,
      address: patientProfileTable.address,
      emergencyContactName: patientProfileTable.emergencyContactName,
      emergencyContactPhone: patientProfileTable.emergencyContactPhone,
      userId: userTable.id,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      email: userTable.email,
    })
    .from(patientProfileTable)
    .innerJoin(userTable, eq(patientProfileTable.userId, userTable.id))
    .where(eq(patientProfileTable.id, id))
    .limit(1);

  const patient = result[0];

  if (!patient) {
    throw createError({ statusCode: 404, message: "Not found." });
  }

  return patient;
});
