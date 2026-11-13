import { findBannedClaims } from "./claims";
import type { CategoryContent, LandingContent } from "./types";

const wordCount = (parts: string[]) => parts.join(" ").split(/\s+/).filter(Boolean).length;

function allText(c: CategoryContent | LandingContent): string[] {
  const out: string[] = [c.name, c.seoTitle, c.metaDescription, c.h1, ...c.intro, ...c.mayHelp, ...c.mayNotDo, ...c.requestInfo];
  if ("commonServices" in c) out.push(...c.commonServices, ...c.howToChoose);
  if ("localNotes" in c) out.push(...c.localNotes);
  for (const f of c.faq) out.push(f.q, f.a);
  return out;
}

/** Problems that stop a page from being marked reviewed. Empty = the page is complete. */
export function validateContent(c: CategoryContent | LandingContent): string[] {
  const problems: string[] = [];
  if (c.seoTitle.length < 20 || c.seoTitle.length > 60) problems.push(`seoTitle length ${c.seoTitle.length} (want 20-60)`);
  if (c.metaDescription.length < 70 || c.metaDescription.length > 160) problems.push(`metaDescription length ${c.metaDescription.length} (want 70-160)`);
  if (!c.h1.trim()) problems.push("h1 missing");
  if (wordCount(c.intro) < 80) problems.push("intro under 80 words");
  if (c.mayHelp.length < 3) problems.push("mayHelp needs 3+ items");
  if (c.mayNotDo.length < 2) problems.push("mayNotDo needs 2+ items");
  if (c.requestInfo.length < 3) problems.push("requestInfo needs 3+ items");
  if (c.faq.length < 3) problems.push("faq needs 3+ items");
  if ("commonServices" in c && c.commonServices.length < 4) problems.push("commonServices needs 4+ items");
  if ("howToChoose" in c && c.howToChoose.length < 3) problems.push("howToChoose needs 3+ items");
  for (const text of allText(c)) {
    for (const claim of findBannedClaims(text)) problems.push(`banned claim "${claim}" in: ${text.slice(0, 60)}`);
  }
  return problems;
}

/** 5-word shingle overlap between two texts, 0..1. Used to catch near-duplicate intros. */
export function similarity(a: string, b: string): number {
  const shingles = (s: string) => {
    const w = s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    const set = new Set<string>();
    for (let i = 0; i + 5 <= w.length; i++) set.add(w.slice(i, i + 5).join(" "));
    return set;
  };
  const A = shingles(a);
  const B = shingles(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  A.forEach((s) => B.has(s) && shared++);
  return shared / (A.size + B.size - shared);
}
