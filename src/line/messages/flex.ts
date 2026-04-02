import { messagingApi } from "@line/bot-sdk";

type FlexBubble = messagingApi.FlexBubble;
type FlexComponent = messagingApi.FlexComponent;
type FlexMessage = messagingApi.FlexMessage;

/** Create a simple info bubble with a header, body sections, and optional footer */
export function infoBubble(opts: {
  title: string;
  heroImageUrl?: string;
  body: FlexComponent[];
  footer?: FlexComponent[];
}): FlexBubble {
  const bubble: FlexBubble = {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: opts.title,
          weight: "bold",
          size: "xl",
          color: "#1a1a1a",
        },
      ],
      paddingAll: "lg",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: opts.body,
      spacing: "md",
      paddingAll: "lg",
    },
  };

  if (opts.heroImageUrl) {
    bubble.hero = {
      type: "image",
      url: opts.heroImageUrl,
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover",
    };
  }

  if (opts.footer && opts.footer.length > 0) {
    bubble.footer = {
      type: "box",
      layout: "vertical",
      contents: opts.footer,
      spacing: "sm",
      paddingAll: "lg",
    };
  }

  return bubble;
}

/** Wrap a bubble (or carousel) into a FlexMessage */
export function flexMessage(
  altText: string,
  contents: messagingApi.FlexContainer
): FlexMessage {
  return { type: "flex", altText, contents };
}

/** Create a labeled text row (label: value) */
export function labeledRow(label: string, value: string): FlexComponent {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: label,
        size: "sm",
        color: "#888888",
        flex: 0,
      } as FlexComponent,
      {
        type: "text",
        text: value,
        size: "sm",
        color: "#333333",
        wrap: true,
        flex: 1,
      } as FlexComponent,
    ],
    spacing: "md",
  };
}

/** Separator line */
export function separator(): FlexComponent {
  return { type: "separator", margin: "md" } as FlexComponent;
}

/** URI action button */
export function uriButton(label: string, uri: string): FlexComponent {
  return {
    type: "button",
    action: { type: "uri", label, uri },
    style: "primary",
    color: "#4a90d9",
    height: "sm",
  } as FlexComponent;
}
