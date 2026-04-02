import { webhook, messagingApi } from "@line/bot-sdk";

export interface ModuleContext {
  event: webhook.Event;
  userId: string;
  replyToken: string;
  reply: (messages: messagingApi.Message[]) => Promise<void>;
}

export interface ModuleHandler {
  name: string;
  canHandle(event: webhook.Event): boolean;
  handle(ctx: ModuleContext): Promise<void>;
}

/** Extract text from a message event, or null */
export function getMessageText(event: webhook.Event): string | null {
  if (event.type === "message" && "message" in event) {
    const msg = (event as webhook.MessageEvent).message;
    if (msg.type === "text" && "text" in msg) {
      return (msg as webhook.TextMessageContent).text;
    }
  }
  return null;
}

/** Extract postback data from a postback event, or null */
export function getPostbackData(event: webhook.Event): string | null {
  if (event.type === "postback" && "postback" in event) {
    return (event as webhook.PostbackEvent).postback.data;
  }
  return null;
}

/** Parse postback data string like "action=info&id=1" into a Map */
export function parsePostbackParams(data: string): Map<string, string> {
  const params = new Map<string, string>();
  for (const pair of data.split("&")) {
    const [key, value] = pair.split("=");
    if (key) params.set(key, value || "");
  }
  return params;
}
