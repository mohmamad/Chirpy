import { Request, Response } from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { hashPassword } from "../auth.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

type UserRequest = {
  email: string;
  password: string;
};
export async function handlerAddUser(req: Request, res: Response) {
  const userReq = req.body as UserRequest;
  if (userReq.email.length > 256 || userReq.email.length < 1) {
    respondWithError(res, 400, "Email must be between 1 and 256 characters");
    return;
  }
  const hashedPassword = await hashPassword(userReq.password);
  const user = await createUser(userReq.email, hashedPassword);
  if (!user) {
    respondWithError(res, 400, "User already exists");
    return;
  }
  respondWithJSON(res, 201, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
  });
}

export async function handlerUpdateUser(req: Request, res: Response) {
  const userReq = req.body as UserRequest;
  if (userReq.email.length > 256 || userReq.email.length < 1) {
    respondWithError(res, 400, "Email must be between 1 and 256 characters");
    return;
  }
  let userId = "";
  try {
    const token = getBearerToken(req);
    userId = validateJWT(token, config.JWTConfig.secret);
  } catch {
    respondWithError(res, 401, "Unauthorized");
    return;
  }
  const hashedPassword = await hashPassword(userReq.password);
  const user = await updateUser(userId, userReq.email, hashedPassword);
  if (!user) {
    respondWithError(res, 400, "user not found");
    return;
  }
  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
  });
}
