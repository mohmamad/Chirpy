import { Request, Response } from "express";
import { APIConfig } from "../config.js";
export function handlerReset(req: Request, res: Response) {
  APIConfig.fileserverHits = 0;
  return res.status(200).type("text/plain; charset=utf-8").send("");
}
