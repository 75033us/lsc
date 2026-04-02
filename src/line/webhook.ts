import { webhook } from "@line/bot-sdk";
import { lineClient } from "./client.js";
import { ModuleHandler, ModuleContext } from "../modules/types.js";

const modules: ModuleHandler[] = [];

export function registerModule(handler: ModuleHandler): void {
  modules.push(handler);
}

function getUserId(event: webhook.Event): string | null {
  if ("source" in event && event.source) {
    if (event.source.type === "user" && "userId" in event.source) {
      return (event.source as webhook.UserSource).userId ?? null;
    }
  }
  return null;
}

function getReplyToken(event: webhook.Event): string | null {
  if ("replyToken" in event) {
    return (event as { replyToken: string }).replyToken ?? null;
  }
  return null;
}

export async function handleEvent(event: webhook.Event): Promise<void> {
  const userId = getUserId(event);
  const replyToken = getReplyToken(event);

  if (!userId || !replyToken) return;

  const ctx: ModuleContext = {
    event,
    userId,
    replyToken,
    reply: async (messages) => {
      await lineClient.replyMessage({ replyToken, messages });
    },
  };

  for (const mod of modules) {
    if (mod.canHandle(event)) {
      try {
        await mod.handle(ctx);
      } catch (err) {
        console.error(`[${mod.name}] Error:`, err);
      }
      return;
    }
  }

  // No module matched — ignore silently
}
