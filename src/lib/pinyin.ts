import { pinyin } from "pinyin-pro";

export function generatePinyin(chinese: string): string {
  if (!chinese || !/[\u4e00-\u9fff]/.test(chinese)) {
    return "";
  }

  return pinyin(chinese, {
    toneType: "symbol", // Use tone marks (ā, á, ǎ, à)
    type: "string",
  });
}

export function generatePinyinForTitle(chinese: string): string {
  const py = generatePinyin(chinese);
  // Capitalize first letter of each word for title
  return py
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
