import { userTable, sessionTable } from "~~/server/db/schema";
import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export default eventHandler(async (event) => {
  const { email, password } = await readBody(event);
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "All the data must be provided in data body.",
    });
  }

  const db = useDrizzle();

  const users = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  const user = users[0];
  if (!user) {
    throw createError({ statusCode: 401, message: "Credențiale invalide." });
  }

  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    throw createError({ statusCode: 401, message: "Credențiale invalide." });
  }

  const sessionId = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
  await db.insert(sessionTable).values({
    id: sessionId,
    userId: user.id,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
  });

  setCookie(event, "session_id", sessionId, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

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
