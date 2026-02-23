import { Request, Response } from "express";

export function handlerValidateChirp(req: Request, res: Response) {
  type responseData = {
    error: string;
    valid: boolean;
  };
  type chirpRequest = {
    body: string;
  };
  const chirp = req.body as chirpRequest;
  const response: responseData = {
    error: "",
    valid: false,
  };

  if (typeof chirp.body !== "string") {
    response.error = "Something went wrong";
    return res.status(400).type("text/plain; charset=utf-8").send(response);
  } else if (chirp.body.length > 140) {
    response.error = "Chirp is too long";
    return res.status(400).type("text/plain; charset=utf-8").send(response);
  }
  response.valid = true;
  return res.status(200).type("text/plain; charset=utf-8").send(response);
}
