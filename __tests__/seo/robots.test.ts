/**
 * robots.test.ts
 * Tests for app/robots.ts SEO fixes:
 *   - No `host` field in output
 *   - Single wildcard rule only (no duplicate Googlebot)
 *   - Correct paths are disallowed
 *   - Sitemap URL is correct
 */
import robots from "@/app/robots";

describe("robots.ts", () => {
  let result: ReturnType<typeof robots>;

  beforeAll(() => {
    result = robots();
  });

  it("should NOT include a host field (invalid robots.txt directive)", () => {
    // The `host` field was being output as "Host: ..." which some crawlers reject
    expect((result as Record<string, unknown>).host).toBeUndefined();
  });

  it("should have exactly ONE rule (no duplicate Googlebot rule)", () => {
    expect(result.rules).toHaveLength(1);
  });

  it("should have the single rule set for wildcard userAgent *", () => {
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rule.userAgent).toBe("*");
  });

  it("should disallow private auth routes", () => {
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    const disallow = rule.disallow as string[];
    expect(disallow).toContain("/login");
    expect(disallow).toContain("/signUp");
    expect(disallow).toContain("/forgotPassword");
    expect(disallow).toContain("/resetPassword");
  });

  it("should disallow /cus/ private area routes", () => {
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    const disallow = rule.disallow as string[];
    expect(disallow).toContain("/cus/bookings");
    expect(disallow).toContain("/cus/notifications");
    // /cus/reels is NOT in disallow list explicitly — it's just not in sitemap
  });

  it("should disallow service provider private area", () => {
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    const disallow = rule.disallow as string[];
    expect(disallow).toContain("/spr/");
    expect(disallow).toContain("/supplier/");
  });

  it("should allow / (root)", () => {
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rule.allow).toBe("/");
  });

  it("should have a valid sitemap URL", () => {
    expect(result.sitemap).toBe("https://kartsquare.com/sitemap.xml");
  });

  it("should NOT have a Googlebot-specific rule (duplicate)", () => {
    if (!Array.isArray(result.rules)) return;
    const googlebotRule = result.rules.find(
      (r: { userAgent?: string | string[] }) =>
        r.userAgent === "Googlebot" ||
        (Array.isArray(r.userAgent) && r.userAgent.includes("Googlebot"))
    );
    expect(googlebotRule).toBeUndefined();
  });
});
