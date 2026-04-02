import express from "express";
import { middleware, HTTPFetchError } from "@line/bot-sdk";
import { webhook as webhookTypes } from "@line/bot-sdk";
import { config } from "./config.js";
import { handleEvent } from "./line/webhook.js";

export function createServer(): express.Express {
  const app = express();

  // Health check (before middleware — no signature needed)
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // LINE webhook endpoint
  app.post(
    "/webhook",
    middleware({ channelSecret: config.line.channelSecret }),
    async (req: express.Request, res: express.Response) => {
      const body = req.body as webhookTypes.CallbackRequest;
      const events = body.events || [];

      await Promise.allSettled(events.map(handleEvent));

      res.json({ status: "ok" });
    }
  );

  // Error handler
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      if (err instanceof HTTPFetchError) {
        console.error("LINE API error:", err.status, err.body);
        res.status(500).json({ error: "LINE API error" });
      } else {
        console.error("Server error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  return app;
}
