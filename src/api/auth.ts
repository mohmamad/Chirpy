import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { addRefreshToken } from "../db/queries/refreshTokens.js";
import {
  checkPasswordHash,
  makeRefreshToken,
  getBearerToken,
  makeJWT,
} from "../auth.js";
import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import {
  getRefreshToken,
  revokeRefreshToken,
} from "../db/queries/refreshTokens.js";

type UserRequest = {
  email: string;
  password: string;
};
export async function handlerLogin(req: Request, res: Response) {
  const userReq = req.body as UserRequest;
  if (userReq.email.length > 256 || userReq.email.length < 1) {
    respondWithError(res, 400, "Email must be between 1 and 256 characters");
    return;
  }
  const user = await getUserByEmail(userReq.email);
  if (!user) {
    respondWithError(res, 404, "User not found");
    return;
  }
  const isPasswordCorrect = await checkPasswordHash(
    userReq.password,
    user.password,
  );
  const token = makeJWT(
    user.id,
    config.JWTConfig.defaultDuration,
    config.JWTConfig.secret,
  );
  if (!isPasswordCorrect) {
    respondWithError(res, 401, "Incorrect email or password");
    return;
  }

  const refreshToken = makeRefreshToken();
  await addRefreshToken(user.id, refreshToken);

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
    token: token,
    refreshToken: refreshToken,
  });
}

export async function handlerRefresh(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  const refreshTokenDB = await getRefreshToken(refreshToken);
  if (!refreshTokenDB) {
    respondWithError(res, 401, "Invalid refresh token");
    return;
  }
  if (refreshTokenDB.revokedAt !== null) {
    respondWithError(res, 401, "Refresh token revoked");
    return;
  }
  const token = makeJWT(
    refreshTokenDB.userId,
    config.JWTConfig.defaultDuration,
    config.JWTConfig.secret,
  );
  respondWithJSON(res, 200, { token: token });
}

export async function handlerRevoke(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  await revokeRefreshToken(refreshToken);
  respondWithJSON(res, 204, { message: "Refresh token revoked" });
}
