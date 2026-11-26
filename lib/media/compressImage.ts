/**
 * Shrink photos in the browser before upload: phone photos are often 4–12 MB, and uploading them as they are
 * is slow on mobile data and makes every page that shows them heavy.
 *
 * - Only raster photos (JPEG, PNG, WebP, HEIC where the browser can decode it). GIF (animation), SVG, PDF and
 *   video pass through untouched.
 * - Longest side capped at MAX_DIMENSION; re-encoded as JPEG at QUALITY (PNG with transparency stays PNG).
 * - The original is kept when compressing would not make it meaningfully smaller, or when the browser cannot
 *   decode it. Compression never blocks an upload.
 */

export const MAX_DIMENSION = 1920;
export const QUALITY = 0.82;
/** Files smaller than this are already light enough. */
export const SKIP_BELOW_BYTES = 300 * 1024;

const PASSTHROUGH_TYPES = new Set(["image/gif", "image/svg+xml"]);

/** Whether a file is a photo worth compressing. */
export const shouldCompress = (file: Pick<File, "type" | "size">): boolean =>
  file.type.startsWith("image/") &&
  !PASSTHROUGH_TYPES.has(file.type) &&
  file.size >= SKIP_BELOW_BYTES;

/** Target size for an image, keeping its aspect ratio, never enlarging it. */
export const targetSize = (width: number, height: number, max = MAX_DIMENSION) => {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
};

const loadBitmap = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
  if (typeof createImageBitmap === "function") {
    // Respect EXIF orientation so portrait phone photos do not come out sideways.
    return createImageBitmap(file, { imageOrientation: "from-image" });
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
};

export async function compressImage(file: File): Promise<File> {
  if (typeof window === "undefined" || !shouldCompress(file)) return file;
  try {
    const bitmap = await loadBitmap(file);
    const { width, height } = targetSize(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    if ("close" in bitmap) bitmap.close();

    const keepPng = file.type === "image/png";
    const type = keepPng ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
    // Keep the original unless the result is at least 10% smaller.
    if (!blob || blob.size >= file.size * 0.9) return file;

    const name = keepPng ? file.name : file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type, lastModified: file.lastModified });
  } catch {
    return file;
  }
}

/** Compress every photo in a list (other files pass through), in parallel. */
export const compressImages = (files: File[]): Promise<File[]> =>
  Promise.all(files.map(compressImage));
