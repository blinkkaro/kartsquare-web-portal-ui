import { PostType } from "./postInterfaces";

/**
 * How a post's media decides what it is. A reel is not a separate kind of post:
 * it is a public post with post_type "video", which the backend's /social_posts/reels
 * returns. A post mixing video and photos is "mixed" and never becomes a reel.
 */

/** A video file by its URL's extension (the uploaded files keep theirs). */
export const isVideoUrl = (url: string): boolean => /\.(mp4|mov|webm|m4v|m3u8)(\?|$)/i.test(url);

/** The post type for the files a user picked: video only → VIDEO (a reel), photos only → IMAGE, both → MIXED. */
export const postTypeForFiles = (files: ReadonlyArray<{ type: string }>): PostType => {
  const hasVideo = files.some((f) => f.type.startsWith("video/"));
  const hasImage = files.some((f) => f.type.startsWith("image/"));
  if (hasVideo && hasImage) return PostType.MIXED;
  if (hasVideo) return PostType.VIDEO;
  return PostType.IMAGE;
};

/**
 * The video to play for a reel. The composer uploads a thumbnail image before each
 * video, so the video is found by type, not by position; when no URL has a video
 * extension, the second URL (after the thumbnail) is used, then the first.
 */
export const reelVideoUrl = (urls: ReadonlyArray<string>): string | undefined =>
  urls.find(isVideoUrl) ?? (urls.length > 1 ? urls[1] : urls[0]);
