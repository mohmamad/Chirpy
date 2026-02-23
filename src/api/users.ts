import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerAddUser(req: Request, res: Response) {
  type creatUserRequest = {
    email: string;
  };
  const userReq = req.body as creatUserRequest;
  if (userReq.email.length > 256 || userReq.email.length < 1) {
    respondWithError(res, 400, "Email must be between 1 and 256 characters");
    return;
  }
  const user = await createUser(userReq.email);
  if (!user) {
    respondWithError(res, 400, "User already exists");
    return;
  }
  respondWithJSON(res, 201, user);
}
