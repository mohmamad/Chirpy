import { Request, Response } from "express";
export async function handlerReadiness(req: Request, res: Response) {
  return res.status(200).type("text/plain; charset=utf-8").send("OK");
}
