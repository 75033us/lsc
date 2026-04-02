/**
 * One-time script to create and set the default rich menu.
 * Run with: npm run setup-rich-menu
 *
 * Note: You need a 2500x1686 or 2500x843 image for the rich menu.
 * This script creates the menu structure; you'll upload the image separately
 * via the LINE Official Account Manager or the API.
 */
import "../src/config.js";
import { messagingApi } from "@line/bot-sdk";
import { config } from "../src/config.js";

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: config.line.channelAccessToken,
});

async function main() {
  // Create a 2x3 rich menu (2500x1686 image, 6 areas)
  const richMenuId = await client.createRichMenu({
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "LSC Main Menu",
    chatBarText: "選單",
    areas: [
      // Row 1
      {
        bounds: { x: 0, y: 0, width: 833, height: 843 },
        action: { type: "postback", data: "action=schedule", displayText: "主日崇拜" },
      },
      {
        bounds: { x: 833, y: 0, width: 834, height: 843 },
        action: { type: "postback", data: "action=groups", displayText: "小組" },
      },
      {
        bounds: { x: 1667, y: 0, width: 833, height: 843 },
        action: { type: "postback", data: "action=events", displayText: "活動" },
      },
      // Row 2
      {
        bounds: { x: 0, y: 843, width: 833, height: 843 },
        action: { type: "postback", data: "action=prayer", displayText: "代禱請求" },
      },
      {
        bounds: { x: 833, y: 843, width: 834, height: 843 },
        action: { type: "postback", data: "action=giving", displayText: "奉獻" },
      },
      {
        bounds: { x: 1667, y: 843, width: 833, height: 843 },
        action: { type: "postback", data: "action=more", displayText: "更多" },
      },
    ],
  });

  console.log("Rich menu created:", richMenuId);

  // Set as default for all users
  await client.setDefaultRichMenu(richMenuId);
  console.log("Set as default rich menu");

  console.log("\nNext steps:");
  console.log("1. Upload a 2500x1686 rich menu image via LINE Official Account Manager");
  console.log("   or use the Messaging API to upload it to this rich menu ID.");
  console.log(`2. Rich Menu ID: ${richMenuId}`);
}

main().catch(console.error);
