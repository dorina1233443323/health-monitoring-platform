import { hash } from "bcrypt-ts";
import { patientProfileTable, userTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { email, password, first_name, last_name } = await readBody(event);
  if (!email || !password || !first_name || !last_name) {
    throw createError({
      statusCode: 400,
      message: "All the data must be provided in data body.",
    });
  }

  const hashedPassword = await hash(password, 8);
  const now = new Date().toISOString();
  const db = useDrizzle();

  const insertResult = await db
    .insert(userTable)
    .values({
      email,
      password: hashedPassword,
      firstName: first_name,
      lastName: last_name,
      role: "patient",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const user = insertResult[0];

  if (!user) {
    throw createError({
      statusCode: 500,
      message: "User could not be created.",
    });
  }

  await db
    .insert(patientProfileTable)
    .values({ userId: user.id, createdAt: now });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
});
