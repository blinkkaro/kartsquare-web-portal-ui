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
