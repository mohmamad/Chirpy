import { Request, Response } from "express";
import { config } from "../config.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { deleteUsers } from "../db/queries/users.js";
export async function handlerReset(req: Request, res: Response) {
  config.api.fileServerHits = 0;
  if (config.platform === "dev") {
    await deleteUsers();
  } else {
    respondWithError(res, 403, "Forbidden");
    return;
  }

  respondWithJSON(res, 200, { message: "Reset successful" });
}
