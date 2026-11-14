/**
 * Wording Kartsquare cannot back with product behaviour or approved terms. The copy
 * in data/services must not contain any of it. A test runs every string through here.
 */
const BANNED: Array<{ label: string; pattern: RegExp }> = [
  { label: "verified", pattern: /\bverified\b/i },
  { label: "guarantee", pattern: /\bguarantee[sd]?\b/i },
  { label: "best", pattern: /\b(the )?best\b/i },
  { label: "top-rated", pattern: /\btop[- ]rated\b/i },
  { label: "trusted", pattern: /\btrusted\b/i },
  { label: "certified", pattern: /\bcertified\b/i },
  { label: "licensed", pattern: /\blicen[sc]ed\b/i },
  { label: "insured", pattern: /\binsured\b/i },
  { label: "24/7", pattern: /24\s*[/x]\s*7|round[- ]the[- ]clock/i },
  { label: "instant", pattern: /\binstant(ly)?\b/i },
  { label: "fixed price", pattern: /\bfixed[- ](price|rate)s?\b/i },
  { label: "fast", pattern: /\b(fast|quick|speedy)\s+(response|service|repair|booking)/i },
  { label: "same day", pattern: /\bsame[- ]day\b/i },
  { label: "lowest price", pattern: /\b(lowest|cheapest)\b/i },
  { label: "number one", pattern: /\b(no\.? ?1|number one|#1)\b/i },
];

/** Returns the labels of every banned claim found in `text`. */
export function findBannedClaims(text: string): string[] {
  // "does not guarantee a result" is a disclaimer, not a claim.
  const claimed = text.replace(/\b(?:not|never|cannot|can't|no)\s+(?:\w+\s+)?(?:guarantee[sd]?|verif(?:y|ied))\b/gi, " ");
  return BANNED.filter((b) => b.pattern.test(claimed)).map((b) => b.label);
}
