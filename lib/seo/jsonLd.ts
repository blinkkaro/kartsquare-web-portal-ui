/**
 * Serialise a JSON-LD node for an inline <script type="application/ld+json">.
 * Escapes the characters that could close the script element or be read as HTML
 * (`<`, `>`, `&`) and the two line separators that break some JS parsers.
 */
export function serializeJsonLd(node: unknown): string {
  return JSON.stringify(node)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(new RegExp("\\u2028", "g"), "\\u2028")
    .replace(new RegExp("\\u2029", "g"), "\\u2029");
}
