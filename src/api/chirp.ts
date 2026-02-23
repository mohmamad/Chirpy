import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type chirpRequest = {
    body: string;
  };

  const chirp = req.body as chirpRequest;

  const maxChirpLength = 140;
  if (typeof chirp.body !== "string") {
    respondWithError(res, 400, "Request body must be a string");
    return;
  } else if (chirp.body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }
  const forbiddenWords = ["kerfuffle", "sharbert", "fornax"];
  let Chirps = chirp.body.split(" ");

  for (const word of forbiddenWords) {
    Chirps = Chirps.map((chirpWord) => {
      if (chirpWord.toLowerCase() === word.toLowerCase()) {
        return "****";
      }
      return chirpWord;
    });
  }
  const cleanedBody = Chirps.join(" ");

  respondWithJSON(res, 200, { cleanedBody: cleanedBody });
}
