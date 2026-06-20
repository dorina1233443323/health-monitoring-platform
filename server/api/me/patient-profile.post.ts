import { eq } from "drizzle-orm";
import { patientProfileTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const body = await readBody(event);
  const db = useDrizzle();

  const existing = await db
    .select()
    .from(patientProfileTable)
    .where(eq(patientProfileTable.userId, user.id))
    .limit(1);

  if (existing[0]) {
    throw createError({
      statusCode: 409,
      message: "Profilul de pacient există deja.",
    });
  }

  await db.insert(patientProfileTable).values({
    userId: user.id,
    birthDate: body.birthDate,
    sex: body.sex,
    heightCm: body.heightCm,
    weightKg: body.weightKg,
    phone: body.phone,
    address: body.address,
    emergencyContactName: body.emergencyContactName,
    emergencyContactPhone: body.emergencyContactPhone,
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
  };
});
