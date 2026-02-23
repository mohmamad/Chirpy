import { NextFunction, Request, Response } from "express";
import { APIConfig } from "../config.js";
import { respondWithError } from "./json.js";

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

export function middlewareErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err.stack);
  respondWithError(res, 500, "Something went wrong on our end");
}
