/** One question and answer. Rendered on the page and, once reviewed, as FAQPage JSON-LD. */
export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Static content for one category page, /services/c/{slug}.
 *
 * `reviewed` is the indexing gate. It is flipped to true only by a person, in a pull
 * request, after reading the copy. Until then the page renders with noindex and stays
 * out of the sitemap.
 */
export interface CategoryContent {
  /** Must match categories.slug in the API. */
  slug: string;
  name: string;
  /** One line saying what the category covers (the category description from the API). */
  tagline?: string;
  /** <title>, without the brand: the metadata builder adds it. */
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  commonServices: string[];
  mayHelp: string[];
  mayNotDo: string[];
  howToChoose: string[];
  requestInfo: string[];
  faq: FaqItem[];
  /** Slugs of other categories in this file. */
  related: string[];
  /** Optional long-form guide shown under "What is included": plain paragraphs under their own H3s. */
  guide?: GuideSection[];
  /** Official pages behind any factual line in the guide, shown under it. */
  sources?: { label: string; href: string }[];
  reviewed: boolean;
}

/** One titled block of long-form copy. */
export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

/** A symptom a customer notices, and what it often points to. Never a diagnosis. */
export interface Symptom {
  sign: string;
  meaning: string;
}

/**
 * Static guide for one service inside a category, /services/c/{category}/{slug}.
 * Same review gate as CategoryContent: noindex and out of the sitemap until `reviewed` is true.
 */
export interface SubServiceContent {
  /** Parent category slug; must exist in CATEGORY_CONTENT. */
  categorySlug: string;
  slug: string;
  /** Short name, as the parent category lists it ("Laptop repair"). */
  name: string;
  /** Bundled Phosphor icon name for the tile, e.g. "ph:laptop-duotone". */
  icon: string;
  /** One line for cards and the hero. */
  tagline: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  symptoms: Symptom[];
  guide: GuideSection[];
  mayHelp: string[];
  mayNotDo: string[];
  costFactors: string[];
  beforeRepair: string[];
  howToChoose: string[];
  requestInfo: string[];
  faq: FaqItem[];
  /** Words that mark a provider's listing as this service (matched against name, sub-category and description). */
  matchTerms: string[];
  reviewed: boolean;
}

/** Extra copy for an existing /{city}/{category}/{sub-category} page. */
export interface LandingContent {
  citySlug: string;
  categorySlug: string;
  subCategorySlug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  mayHelp: string[];
  mayNotDo: string[];
  requestInfo: string[];
  localNotes: string[];
  faq: FaqItem[];
  reviewed: boolean;
}
