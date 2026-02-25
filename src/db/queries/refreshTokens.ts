import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
import { config } from "../../config.js";
import { eq } from "drizzle-orm";

export async function addRefreshToken(userId: string, token: string) {
  await db.insert(refreshTokens).values({
    token: token,
    userId: userId,
    expiresAt: new Date(Date.now() + config.JWTConfig.refreshDuration),
  });
}

export async function getRefreshToken(token: string) {
  const [refreshToken] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token))
    .limit(1);
  return refreshToken;
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(Date.now()) })
    .where(eq(refreshTokens.token, token));
}
