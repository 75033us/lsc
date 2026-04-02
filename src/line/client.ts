import { messagingApi } from "@line/bot-sdk";
import { config } from "../config.js";

export const lineClient = new messagingApi.MessagingApiClient({
  channelAccessToken: config.line.channelAccessToken,
});
