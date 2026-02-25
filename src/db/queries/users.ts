import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(email: string, password: string) {
  const [result] = await db
    .insert(users)
    .values({ email: email, password: password })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
}

export async function updateUser(
  userId: string,
  email: string,
  password: string,
) {
  const [result] = await db
    .update(users)
    .set({ email: email, password: password })
    .where(eq(users.id, userId))
    .returning();

  return result;
}

export async function upgradeUser(userId: string) {
  const [result] = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning();
  return result;
}

export async function getUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user;
}
