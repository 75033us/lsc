import { webhook } from "@line/bot-sdk";
import { ModuleHandler, getMessageText, getPostbackData, parsePostbackParams } from "../types.js";
import { infoBubble, flexMessage, labeledRow, separator, uriButton } from "../../line/messages/flex.js";
import { readFileSync } from "fs";
import { resolve } from "path";

const dataPath = resolve(__dirname, "../../../data/church-info.json");
const churchInfo = JSON.parse(readFileSync(dataPath, "utf-8"));

const KEYWORDS = ["教會", "教會資訊", "church", "info", "資訊"];

export const infoModule: ModuleHandler = {
  name: "info",

  canHandle(event: webhook.Event): boolean {
    const text = getMessageText(event);
    if (text && KEYWORDS.some((kw) => text.includes(kw))) return true;

    const data = getPostbackData(event);
    if (data) {
      const params = parsePostbackParams(data);
      if (params.get("action") === "info") return true;
    }

    return false;
  },

  async handle(ctx) {
    const services = churchInfo.services
      .map((s: { name: string; day: string; time: string }) => `${s.name}：${s.day} ${s.time}`)
      .join("\n");

    const bubble = infoBubble({
      title: `⛪ ${churchInfo.name.chinese}`,
      body: [
        labeledRow("組織", churchInfo.organization),
        labeledRow("地址", churchInfo.address),
        separator(),
        labeledRow("聚會", services),
        separator(),
        {
          type: "text",
          text: "📖 我們的信仰",
          weight: "bold",
          size: "sm",
          color: "#1a1a1a",
          margin: "md",
        },
        ...churchInfo.beliefs.map((b: string) => ({
          type: "text" as const,
          text: `• ${b}`,
          size: "xs",
          color: "#555555",
          wrap: true,
        })),
      ],
      footer: churchInfo.mapUrl
        ? [uriButton("📍 Google Maps", churchInfo.mapUrl)]
        : undefined,
    });

    await ctx.reply([flexMessage("教會資訊", bubble)]);
  },
};
