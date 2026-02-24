import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string> {
  const hash = await argon2.hash(password);
  return hash;
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return await argon2.verify(hash, password);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
  const iat = Math.floor(Date.now() / 1000);
  const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: iat,
    exp: iat + expiresIn,
  };

  const token = jwt.sign(payload, secret);
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  const payload = jwt.verify(tokenString, secret) as JwtPayload;
  if (payload.sub === undefined) throw new Error("Invalid token");
  return payload.sub;
}
