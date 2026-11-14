import manifest from "@/data/seo/metaManifest.json";

export type MetaManifestStatus =
  "ready" | "blocked" | "needs-approval" | "stage-2-pending-backend-override";

export interface MetaManifestEntry {
  sourceRow: number;
  type: "static" | "blog" | "service" | "provider" | "product";
  key: string;
  backendPageKey?: string | null;
  sheetUrl: string;
  resolvedPath: string;
  title: string;
  description: string;
  status: MetaManifestStatus;
  reason?: string;
}

const ENTRIES = manifest.entries as MetaManifestEntry[];

/**
 * Reviewed title/description for a static page or blog. Only `ready` rows are
 * returned; blocked or unapproved rows yield `undefined` so the caller keeps its
 * existing copy. The same manifest feeds the backend `site_page_seo` seed.
 */
export function manifestCopy(key: string): { title: string; description: string } | undefined {
  const entry = ENTRIES.find((e) => e.key === key && e.status === "ready");
  if (!entry?.title.trim() || !entry.description.trim()) return undefined;
  return { title: entry.title.trim(), description: entry.description.trim() };
}
