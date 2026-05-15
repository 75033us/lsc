import { Hono } from "hono";
import { messagingApi, validateSignature, webhook } from "@line/bot-sdk";

type Env = {
  ENV: string;
  LINE_CHANNEL_ACCESS_TOKEN?: string;
  LINE_CHANNEL_SECRET?: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) =>
  c.json({
    ok: true,
    env: c.env.ENV,
    hasSdk: typeof messagingApi.MessagingApiClient === "function",
    hasValidator: typeof validateSignature === "function",
  }),
);

app.post("/webhook", async (c) => {
  const secret = c.env.LINE_CHANNEL_SECRET ?? "spike-secret";
  const signature = c.req.header("x-line-signature") ?? "";
  const raw = await c.req.text();

  const ok = validateSignature(raw, secret, signature);
  if (!ok) return c.json({ error: "bad signature" }, 401);

  const body = JSON.parse(raw) as { events: webhook.Event[] };
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: c.env.LINE_CHANNEL_ACCESS_TOKEN ?? "",
  });

  for (const ev of body.events) {
    if (ev.type === "message" && ev.message.type === "text" && "replyToken" in ev && ev.replyToken) {
      await client.replyMessage({
        replyToken: ev.replyToken,
        messages: [{ type: "text", text: `echo: ${ev.message.text}` }],
      });
    }
  }
  return c.json({ ok: true });
});

export default app;
