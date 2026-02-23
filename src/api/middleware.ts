import { NextFunction, Request, Response } from "express";
import { APIConfig } from "../config.js";

export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    if (res.statusCode >= 300) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
      );
    }
  });

  next();
}

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.url.includes("reset") && !req.url.includes("metrics"))
    res.on("finish", () => {
      APIConfig.fileserverHits += 1;
    });

  next();
}
