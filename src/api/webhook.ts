import { Request, Response } from "express";
import { upgradeUser, getUserById } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

export async function handlerWebhook(req: Request, res: Response) {
  const apiKey = getAPIKey(req);
  if (apiKey !== config.api.polkaKey) {
    respondWithError(res, 401, "Unauthorized");
    return;
  }
  type WebhookRequest = {
    event: string;
    data: {
      userId: string;
    };
  };
  const webhookRequest = req.body as WebhookRequest;
  console.log(webhookRequest);
  const user = await getUserById(webhookRequest.data.userId);
  if (!user) {
    respondWithError(res, 404, "User not found");
  }
  if (webhookRequest.event === "user.upgraded") {
    await upgradeUser(webhookRequest.data.userId);
  }
  respondWithJSON(res, 204, "");
}
