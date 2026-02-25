import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { UnauthorizedError, BadRequestError } from "./api/errors.js";
import { config } from "./config.js";
import crypto from "crypto";

const TOKEN_ISSUER = config.JWTConfig.issuer;
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
type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000);
  const payload: Payload = {
    iss: TOKEN_ISSUER,
    sub: userID,
    iat: iat,
    exp: iat + expiresIn,
  };

  const token = jwt.sign(payload, secret, { algorithm: "HS256" });
  return token;
}

export function validateJWT(tokenString: string, secret: string) {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new BadRequestError("Malformed authorization header");
  }

  return extractBearerToken(authHeader);
}

export function extractBearerToken(header: string) {
  const splitAuth = header.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header");
  }
  return splitAuth[1];
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex").toString();
}

export function getAPIKey(req: Request) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Malformed authorization header");
  }
  const splitAuth = authHeader.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "ApiKey") {
    throw new UnauthorizedError("Malformed authorization header");
  }
  return splitAuth[1];
}
