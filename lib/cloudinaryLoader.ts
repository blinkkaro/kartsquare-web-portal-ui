import type { ImageLoaderProps } from "next/image";

/** A Cloudinary delivery URL: https://res.cloudinary.com/<cloud>/image/upload/... */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export const isCloudinaryUrl = (src: string): boolean => CLOUDINARY_UPLOAD.test(src);

/**
 * next/image loader for Cloudinary: Cloudinary's CDN resizes the photo to the width
 * next/image asks for, picks AVIF or WebP for the browser (f_auto) and the quality
 * (q_auto, or the one next/image passes). The site's own image optimizer is skipped.
 * c_limit never upscales past the original. Non-Cloudinary URLs pass through unchanged.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const m = CLOUDINARY_UPLOAD.exec(src);
  if (!m) return src;
  const transform = ["f_auto", quality ? `q_${quality}` : "q_auto", "c_limit", `w_${width}`].join(",");
  return `${m[1]}${transform}/${m[2]}`;
}
