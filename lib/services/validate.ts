import { findBannedClaims } from "./claims";
import type { CategoryContent, LandingContent, SubServiceContent } from "./types";

type Content = CategoryContent | LandingContent | SubServiceContent;

const wordCount = (parts: string[]) => parts.join(" ").split(/\s+/).filter(Boolean).length;

function allText(c: Content): string[] {
  const out: string[] = [c.name, c.seoTitle, c.metaDescription, c.h1, ...c.intro, ...c.mayHelp, ...c.mayNotDo, ...c.requestInfo];
  if ("commonServices" in c) out.push(...c.commonServices, ...c.howToChoose);
  if ("localNotes" in c) out.push(...c.localNotes);
  if ("symptoms" in c) {
    out.push(c.tagline, ...c.howToChoose, ...c.costFactors, ...c.beforeRepair);
    for (const s of c.symptoms) out.push(s.sign, s.meaning);
  }
  if ("tagline" in c && c.tagline && !("symptoms" in c)) out.push(c.tagline);
  for (const g of ("guide" in c && c.guide) || []) out.push(g.heading, ...g.paragraphs);
  for (const f of c.faq) out.push(f.q, f.a);
  return out;
}

/** Problems that stop a page from being marked reviewed. Empty = the page is complete. */
export function validateContent(c: Content): string[] {
  const problems: string[] = [];
  // The page title is the SEO title plus " | kartsquare" unless it already names the brand.
  const fullTitle = /kartsquare/i.test(c.seoTitle) ? c.seoTitle : `${c.seoTitle} | kartsquare`;
  if (c.seoTitle.length < 20 || fullTitle.length > 60) problems.push(`title "${fullTitle}" is ${fullTitle.length} chars (want 20-60 with the brand)`);
  if (c.metaDescription.length < 70 || c.metaDescription.length > 160) problems.push(`metaDescription length ${c.metaDescription.length} (want 70-160)`);
  if (!c.h1.trim()) problems.push("h1 missing");
  if (wordCount(c.intro) < 80) problems.push("intro under 80 words");
  if (c.mayHelp.length < 3) problems.push("mayHelp needs 3+ items");
  if (c.mayNotDo.length < 2) problems.push("mayNotDo needs 2+ items");
  if (c.requestInfo.length < 3) problems.push("requestInfo needs 3+ items");
  if (c.faq.length < 3) problems.push("faq needs 3+ items");
  if ("commonServices" in c && c.commonServices.length < 4) problems.push("commonServices needs 4+ items");
  if ("howToChoose" in c && c.howToChoose.length < 3) problems.push("howToChoose needs 3+ items");
  if ("symptoms" in c) {
    if (c.symptoms.length < 4) problems.push("symptoms needs 4+ items");
    if (c.costFactors.length < 3) problems.push("costFactors needs 3+ items");
    if (c.beforeRepair.length < 3) problems.push("beforeRepair needs 3+ items");
    if (c.guide.length < 2) problems.push("guide needs 2+ sections");
    if (c.faq.length < 4) problems.push("faq needs 4+ items");
    if (wordCount(c.intro) + c.guide.reduce((n, g) => n + wordCount(g.paragraphs), 0) < 300) problems.push("intro and guide under 300 words");
  }
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
