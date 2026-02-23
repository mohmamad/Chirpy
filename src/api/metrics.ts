import { Request, Response } from "express";
import { APIConfig } from "../config.js";

export async function handlerMetrics(req: Request, res: Response) {
  return res.status(200).type("text/html; charset=utf-8").send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${APIConfig.fileserverHits} times!</p>
  </body>
</html>`);
}
