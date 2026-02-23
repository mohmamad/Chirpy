import { UUID } from "node:crypto";
import { db } from "../index.js";
import { chirps } from "../schema.js";

export async function createChirp(userId: UUID, body: string) {
  const [result] = await db
    .insert(chirps)
    .values({ userId: userId, body: body })
    .onConflictDoNothing()
    .returning();
  return result;
}
