import { config } from "./config.js";
import { createServer } from "./server.js";

// Register modules (order matters — first match wins)
import { infoModule } from "./modules/info/handler.js";
import { qaModule } from "./modules/qa/handler.js";
import { registerModule } from "./line/webhook.js";

registerModule(infoModule);
registerModule(qaModule); // qa is the fallback, register last

const app = createServer();

app.listen(config.port, () => {
  console.log(`LSC LINE Bot running on port ${config.port}`);
  console.log(`Webhook URL: http://localhost:${config.port}/webhook`);
  console.log(`Health check: http://localhost:${config.port}/health`);
});
