import { db } from "../index.js";
import { chirps } from "../schema.js";
import { eq } from "drizzle-orm";
import { UUID } from "node:crypto";

export async function createChirp(userId: UUID, body: string) {
  const [result] = await db
    .insert(chirps)
    .values({ userId: userId, body: body })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps() {
  const allChirps = await db.select().from(chirps);
  return allChirps;
}

export async function getChirpById(id: string) {
  const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id));
  return chirp;
}

export async function deleteChirpById(id: string) {
  await db.delete(chirps).where(eq(chirps.id, id));
}
