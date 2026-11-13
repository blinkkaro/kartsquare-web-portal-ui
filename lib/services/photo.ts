const PHOTO_HOSTS = /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com)\//;

/**
 * A photo next/image may load, or null so a tile falls back to its icon. Safe to call on the server
 * (it does not import from a client module). Same-site kartsquare.com assets become paths on this deploy.
 */
export const photoSrc = (url?: string | null): string | null => {
  const src = url?.replace(/^https?:\/\/(www\.)?kartsquare\.com(?=\/)/i, "") || null;
  return src && ((src.startsWith("/") && !src.startsWith("//")) || PHOTO_HOSTS.test(src)) ? src : null;
};
