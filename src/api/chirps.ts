import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { UUID } from "node:crypto";
import { createChirp } from "../db/queries/chirps.js";
import { getChirps } from "../db/queries/chirps.js";
import { getChirpById } from "../db/queries/chirps.js";

export async function handlerAddChirps(req: Request, res: Response) {
  type chirpRequest = {
    body: string;
    userId: UUID;
  };
  const chirpReq = req.body as chirpRequest;
  if (!isValidChirp(chirpReq.body)) {
    respondWithError(res, 400, "Chirp must be less than 140 characters");
    return;
  }
  const cleanedBody = validateChirp(chirpReq.body);
  const chirp = await createChirp(chirpReq.userId as UUID, cleanedBody);
  respondWithJSON(res, 201, chirp);
}

export async function handlerGetChirps(req: Request, res: Response) {
  const chirps = await getChirps();
  respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirpById(req: Request, res: Response) {
  const chirpId: UUID = req.params.chirpId as UUID;

  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    respondWithError(res, 404, "Chirp not found");
    return;
  }
  respondWithJSON(res, 200, chirp);
}

export function validateChirp(chirp: string) {
  const forbiddenWords = ["kerfuffle", "sharbert", "fornax"];
  let Chirps = chirp.split(" ");

  for (const word of forbiddenWords) {
    Chirps = Chirps.map((chirpWord) => {
      if (chirpWord.toLowerCase() === word.toLowerCase()) {
        return "****";
      }
      return chirpWord;
    });
  }
  const cleanedBody = Chirps.join(" ");
  return cleanedBody;
}

export function isValidChirp(chirp: string) {
  const maxChirpLength = 140;
  if (typeof chirp !== "string") {
    return false;
  } else if (chirp.length > maxChirpLength) {
    return false;
  }
  return true;
}
