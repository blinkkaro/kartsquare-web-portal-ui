import manifest from "@/data/seo/metaManifest.json";
import { manifestCopy } from "@/lib/seo/metaManifest";

const BANNED = /\b(verified|trusted by|msme|jaipur-born|#1|guaranteed)\b/i;

interface Row {
  key: string;
  status: string;
  title: string;
  description: string;
}
const rows = manifest.entries as Row[];

describe("metaManifest", () => {
  it("returns copy only for ready rows", () => {
    expect(manifestCopy("home")).toBeDefined();
    expect(manifestCopy("about_us")).toBeUndefined();
    expect(manifestCopy("business_listing")).toBeUndefined();
    expect(manifestCopy("does_not_exist")).toBeUndefined();
  });

  it("ready rows have non-empty copy, no banned claims, unique titles", () => {
    const ready = rows.filter((r) => r.status === "ready");
    expect(ready.length).toBeGreaterThan(0);
    const titles = new Set<string>();
    for (const r of ready) {
      expect(r.title.trim()).not.toBe("");
      expect(r.description.trim()).not.toBe("");
      expect(`${r.title} ${r.description}`).not.toMatch(BANNED);
      expect(titles.has(r.title)).toBe(false);
      titles.add(r.title);
    }
  });

  it("blocked and unapproved rows never reach the pages", () => {
    for (const r of rows.filter((x) => x.status !== "ready")) {
      expect(manifestCopy(r.key)).toBeUndefined();
    }
  });
});
