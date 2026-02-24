import { describe, it, expect, beforeAll } from "vitest";
import {
  makeJWT,
  validateJWT,
  hashPassword,
  checkPasswordHash,
} from "../api/auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT", () => {
  const userID = "user-123";
  const secret = "super-secret-key";
  const wrongSecret = "wrong-secret";

  it("should create and validate a JWT", () => {
    const token = makeJWT(userID, 60, secret);

    const sub = validateJWT(token, secret);

    expect(sub).toBe(userID);
  });

  it("should reject expired tokens", async () => {
    const token = makeJWT(userID, 1, secret);

    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(() => validateJWT(token, secret)).toThrow();
  });

  it("should reject tokens signed with the wrong secret", () => {
    const token = makeJWT(userID, 60, secret);

    expect(() => validateJWT(token, wrongSecret)).toThrow();
  });
});
