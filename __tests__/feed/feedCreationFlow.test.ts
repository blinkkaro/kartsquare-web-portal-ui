/**
 * The feed's creation flow for a service provider, on the web side:
 *   - the provider reaches the Feed and Reels from the navigation;
 *   - the composer turns a video-only upload into a "video" post, which is what the
 *     backend's /social_posts/reels returns (a reel is a video post, nothing more);
 *   - the reel player plays the video, not the thumbnail uploaded before it;
 *   - the feed offers "create a post" and "add a story" to any logged-in user, with no
 *     role check, and the requests go to the endpoints the backend serves.
 *
 * The backend half of the flow is covered in
 * kartsquare-app-backend/src/__tests__/feed.creation.flow.test.ts.
 */
import fs from "fs";
import path from "path";
import { PostType } from "@/services/post/postInterfaces";
import { isVideoUrl, postTypeForFiles, reelVideoUrl } from "@/services/post/postMedia";
import { API_ENDPOINTS as POST_ENDPOINTS } from "@/services/post/apiEndpoints";
import { APIENDPOINT as STORY_ENDPOINTS } from "@/services/stories/apiEndPoint";
import { getDesktopNavItems, getMobileNavItems } from "@/constants/navRoutes";
import { UserRole } from "@/utils/auth";

const file = (type: string) => ({ type });
const t = (key: string) => key;
const read = (rel: string) => fs.readFileSync(path.join(__dirname, "..", "..", rel), "utf8");

const THUMB = "https://cdn.example.com/posts/thumbnail.jpg";
const VIDEO = "https://cdn.example.com/posts/clip.mp4";

describe("navigation: a service provider reaches the feed and reels", () => {
  it("desktop menu has Feed (/cus/feed)", () => {
    const hrefs = getDesktopNavItems(UserRole.SERVICE_PROVIDER, t as never).map((i) => i.href);
    expect(hrefs).toContain("/cus/feed");
  });

  it("phone bottom bar has Feed (/cus/feed), right after Home, and Reels (/cus/reels)", () => {
    const hrefs = getMobileNavItems(true, t as never, UserRole.SERVICE_PROVIDER).map((i) => i.href);
    expect(hrefs.slice(0, 2)).toEqual(["/", "/cus/feed"]);
    expect(hrefs).toContain("/cus/reels");
  });

  it("a customer's phone bottom bar has Feed right after Home too", () => {
    const hrefs = getMobileNavItems(true, t as never, UserRole.CUSTOMER).map((i) => i.href);
    expect(hrefs.slice(0, 2)).toEqual(["/", "/cus/feed"]);
  });

  it("each phone bar lists a tab once", () => {
    for (const role of [UserRole.SERVICE_PROVIDER, UserRole.CUSTOMER]) {
      const hrefs = getMobileNavItems(true, t as never, role).map((i) => i.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });
});

describe("composer: what a provider's upload becomes", () => {
  it("a single video is a 'video' post, which is a reel", () => {
    expect(postTypeForFiles([file("video/mp4")])).toBe(PostType.VIDEO);
  });

  it("several videos are still a 'video' post", () => {
    expect(postTypeForFiles([file("video/mp4"), file("video/quicktime")])).toBe(PostType.VIDEO);
  });

  it("photos only are an 'image' post, never a reel", () => {
    expect(postTypeForFiles([file("image/jpeg"), file("image/png")])).toBe(PostType.IMAGE);
  });

  it("a video with photos is 'mixed', never a reel", () => {
    expect(postTypeForFiles([file("video/mp4"), file("image/jpeg")])).toBe(PostType.MIXED);
  });

  it("the post types match the values the backend accepts", () => {
    // kartsquare-app-backend createPostSchema: z.enum(["text", "image", "video", "mixed"])
    expect([PostType.TEXT, PostType.IMAGE, PostType.VIDEO, PostType.MIXED]).toEqual(["text", "image", "video", "mixed"]);
  });

  it("the composer uses this rule to set post_type", () => {
    const src = read("components/pages/myAccount/components/post/AddPostDrawer.tsx");
    expect(src).toMatch(/postTypeForFiles\(selectedFiles\)/);
    expect(src).toMatch(/post_type:\s*postType/);
  });
});

describe("reel player: plays the video, not the thumbnail", () => {
  it("thumbnail first, as the composer uploads it", () => {
    expect(reelVideoUrl([THUMB, VIDEO])).toBe(VIDEO);
  });

  it("video first: still the video", () => {
    expect(reelVideoUrl([VIDEO, THUMB])).toBe(VIDEO);
  });

  it("no thumbnail (its generation failed): the only file", () => {
    expect(reelVideoUrl([VIDEO])).toBe(VIDEO);
  });

  it("URLs with a query string are still recognised as video", () => {
    expect(reelVideoUrl([THUMB, `${VIDEO}?X-Amz-Signature=abc`])).toBe(`${VIDEO}?X-Amz-Signature=abc`);
  });

  it("compressed uploads (.webm) are recognised as video", () => {
    expect(isVideoUrl("https://cdn.example.com/posts/clip.webm")).toBe(true);
    expect(isVideoUrl(THUMB)).toBe(false);
  });

  it("URLs without an extension fall back to the file after the thumbnail", () => {
    expect(reelVideoUrl(["https://cdn.example.com/a", "https://cdn.example.com/b"])).toBe("https://cdn.example.com/b");
  });

  it("the reel player uses this rule", () => {
    expect(read("components/pages/reels/components/ReelContainer.tsx")).toMatch(/reelVideoUrl\(urls\)/);
  });
});

describe("feed page: creating is for any logged-in user", () => {
  const feed = read("components/pages/feed/index.tsx");

  it("offers the post composer and the stories row", () => {
    expect(feed).toMatch(/<AddPostDrawer\b/);
    expect(feed).toMatch(/<FeedStories\b/);
    expect(feed).toMatch(/setComposerOpen\(true\)/);
  });

  it("does not gate creating on the user's role", () => {
    // A role check here would hide posting from providers (or customers).
    expect(feed).not.toMatch(/UserRole\.|AppUserType\.|\.role\s*[!=]==/);
  });

  it("the stories row lets the user add a story", () => {
    const stories = read("components/pages/feed/sections/FeedStories.tsx");
    expect(stories).toMatch(/useAddStory\(\)/);
    expect(stories).toMatch(/<AddStoryModal\b/);
    expect(stories).not.toMatch(/UserRole\.|AppUserType\.|\.role\s*[!=]==/);
  });
});

describe("endpoints match the backend routes", () => {
  it("posts are created at POST /social_posts/ and reels read from /social_posts/reels", () => {
    expect(POST_ENDPOINTS.CREATE_POST).toBe("/social_posts/");
    expect(POST_ENDPOINTS.GET_REELS).toBe("/social_posts/reels");
  });

  it("stories are created at POST /stories", () => {
    expect(STORY_ENDPOINTS.CREATE_STORY).toBe("/stories");
  });
});
