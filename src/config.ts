import dotenv from "dotenv";
dotenv.config();

export const config = {
  line: {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
    channelSecret: process.env.LINE_CHANNEL_SECRET || "",
  },
  port: parseInt(process.env.PORT || "3000", 10),
  databaseUrl: process.env.DATABASE_URL || "./data/lsc.db",
  nodeEnv: process.env.NODE_ENV || "development",
  adminUserIds: (process.env.ADMIN_LINE_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
};
