import { Request, Response } from "express";
export function handlerReadiness(req: Request, res: Response) {
  return res.status(200).type("text/plain; charset=utf-8").send("OK");
}
