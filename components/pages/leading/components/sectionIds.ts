/** Section IDs for in-page navigation and CTA scroll targets */
export const SECTION_IDS = {
  HERO: "hero",
  TAKE_CHARGE: "take-charge",
  CONNECT: "connect",
  SHOW_WHAT_YOU_OFFER: "show-what-you-offer",
  SUCCESS_STORIES: "success-stories",
  HOW_IT_WORKS: "how-it-works",
  FAQ: "faq",
} as const;

/** Target section for primary CTA (e.g. "Start now" → scroll to hero/form) */
export const LEAD_SECTION_ID = SECTION_IDS.HERO;
