import { webhook, messagingApi } from "@line/bot-sdk";
import { ModuleHandler, getMessageText } from "../types.js";
import { readFileSync } from "fs";
import { resolve } from "path";

interface FaqEntry {
  keywords: string[];
  question: string;
  answer: string;
}

const dataPath = resolve(__dirname, "../../../data/faq.json");
const faqData: FaqEntry[] = JSON.parse(readFileSync(dataPath, "utf-8"));

const DEFAULT_REPLY =
  "感謝您的訊息！請使用下方選單或輸入關鍵字查詢：\n" +
  "• 教會 - 教會資訊\n" +
  "• 主日 - 主日崇拜\n" +
  "• 小組 - 小組資訊\n" +
  "• 活動 - 近期活動\n" +
  "• 奉獻 - 奉獻方式\n" +
  "• 代禱 - 代禱請求";

function findFaqMatch(text: string): FaqEntry | null {
  const lower = text.toLowerCase();
  for (const entry of faqData) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry;
    }
  }
  return null;
}

export const qaModule: ModuleHandler = {
  name: "qa",

  canHandle(event: webhook.Event): boolean {
    // QA is the fallback — handle any text message
    return getMessageText(event) !== null;
  },

  async handle(ctx) {
    const text = getMessageText(ctx.event);
    if (!text) return;

    const match = findFaqMatch(text);
    const replyText = match ? match.answer : DEFAULT_REPLY;

    const message: messagingApi.TextMessage = {
      type: "text",
      text: replyText,
    };

    await ctx.reply([message]);
  },
};
