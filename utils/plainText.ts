/**
 * Provider descriptions and post captions sometimes arrive with Markdown markers (`**bold**`) typed or pasted
 * in. We show plain text, so the markers would appear as literal asterisks. This removes them and keeps the words.
 */
export function stripMarkdown(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```\w*\n?/g, ""))
    .replace(/(\*\*|__)([\s\S]+?)\1/g, "$2") // **bold**, __bold__
    .replace(/(^|[^\w*])\*(?!\s)([^*\n]+?)\*(?!\w)/g, "$1$2") // *italic*
    .replace(/`([^`]+)`/g, "$1") // `code`
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // # headings
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, "$1 ($2)") // [text](url)
    .replace(/^\s*[-*]\s+/gm, "• "); // list markers
}
