/**
 * The feed's creation flow for a service provider, on the web side:
 *   - the provider reaches the Feed and Reels from the navigation;
 *   - the composer turns a video-only upload into a "video" post, which is what the
 *     backend's /social_posts/reels returns (a reel is a video post, nothing more);
 *   - the reel player plays the video, not the thumbnail uploaded before it;
 *   - the feed offers "create a post" only to service providers and suppliers (customers
 *     read the feed but never see the composer), and the requests go to the endpoints the
 *     backend serves.
 *
 * The backend half of the flow is covered in
 * kartsquare-app-backend/src/__tests__/feed.creation.flow.test.ts.
 */
import fs from "fs";
import path from "path";
import { PostType } from "@/services/post/postInterfaces";
import { isVideoUrl, mediaAspect, MEDIA_ASPECT_DEFAULT, postTypeForFiles, reelVideoUrl } from "@/services/post/postMedia";
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

describe("feed page: creating is for service providers and suppliers", () => {
  const feed = read("components/pages/feed/index.tsx");

  it("offers the post composer and the stories row", () => {
    expect(feed).toMatch(/<AddPostDrawer\b/);
    expect(feed).toMatch(/<FeedStories\b/);
    expect(feed).toMatch(/setComposerOpen\(true\)/);
  });

  it("decides who can create from the user's role, using the shared rule", () => {
    expect(feed).toMatch(/canCreatePosts\(/);
    expect(feed).toMatch(/const canCreate = isAuthenticated && canCreatePosts\(/);
  });

  it("puts every way of opening the composer behind that rule", () => {
    // the desktop composer card, the phone "+" button and the drawer itself
    expect((feed.match(/canCreate && \(/g) ?? []).length).toBeGreaterThanOrEqual(3);
    // the empty state offers "Create a post" only to creators
    expect(feed).toMatch(/canCreate \? \(\s*<Button onClick=\{\(\) => setComposerOpen\(true\)\}/);
    // and no composer control is gated on being logged in alone
    expect(feed).not.toMatch(/\{isAuthenticated && \(\s*<IconButton/);
    expect(feed).not.toMatch(/isAuthenticated && \(\s*<IconButton/);
  });

  it("the stories row lets the user add a story", () => {
    const stories = read("components/pages/feed/sections/FeedStories.tsx");
    expect(stories).toMatch(/useAddStory\(\)/);
    expect(stories).toMatch(/<AddStoryModal\b/);
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

describe("post media box on phones: the photo's own shape, within 4:5 and 1.91:1", () => {
  it("a 16:9 photo gets a 16:9 box, so no empty bands above and below", () => {
    expect(mediaAspect(1672, 941)).toBeCloseTo(1672 / 941);
  });

  it("a square photo gets a square box", () => {
    expect(mediaAspect(1080, 1080)).toBe(1);
  });

  it("a very tall photo is held at 4:5, so it never fills more than a phone screen", () => {
    expect(mediaAspect(1080, 1920)).toBeCloseTo(4 / 5);
  });

  it("a panorama is held at 1.91:1, so it doesn't shrink to a strip", () => {
    expect(mediaAspect(4000, 1000)).toBeCloseTo(1.91);
  });

  it("unknown sizes (not loaded, broken image) keep the square default", () => {
    expect(mediaAspect(0, 0)).toBe(MEDIA_ASPECT_DEFAULT);
    expect(mediaAspect(1080, 0)).toBe(MEDIA_ASPECT_DEFAULT);
    expect(mediaAspect(Number.NaN, 100)).toBe(MEDIA_ASPECT_DEFAULT);
  });

  it("the post card sizes its media box with this rule", () => {
    const card = read("components/pages/feed/sections/FeedPostCard.tsx");
    expect(card).toMatch(/aspectRatio:\s*String\(aspect\)/);
    expect(card).toMatch(/setAspect\(mediaAspect\(/);
    expect(card).not.toMatch(/aspectRatio:\s*"4 \/ 5"/);
  });
});

describe("feed spacing on phones", () => {
  const feed = read("components/pages/feed/index.tsx");

  it("starts right under the header on phones (MainLayout flushTop)", () => {
    expect(feed).toMatch(/<MainLayout flushTop>/);
    expect(read("app/MainLayoutClient.tsx")).toMatch(/mt:\s*flushTop \? \{ xs: 0, sm: 2 \} : 2/);
  });

  it("doesn't add bottom padding on top of the layout's bottom-bar space below lg", () => {
    expect(feed).toMatch(/pb:\s*\{ xs: 2, lg: 8 \}/);
  });

  it("the infinite-scroll trigger is 1px, not sx's 1 (= 100%, as tall as the feed)", () => {
    expect(feed).toMatch(/<Box ref=\{loadMoreRef\} sx=\{\{ height: "1px" \}\} \/>/);
    expect(feed).not.toMatch(/sx=\{\{[^}]*\b(width|height):\s*1\b/);
  });
});
