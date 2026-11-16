import { buildProfileMetadata } from "@/lib/seo/publicProfile";

const base = { username: "rajeevyadav", first_name: "Rajeev", last_name: "Yadav", business_name: "Rainbow Telecom" };

describe("reviewed SEO copy (seo_title / seo_description)", () => {
  it("wins over the generated meta_title and meta_description on a profile", () => {
    const md = buildProfileMetadata(
      {
        variant: "provider",
        profile: { ...base, meta_title: "Generated | kartsquare", meta_description: "generated", seo_title: "Reviewed title", seo_description: "Reviewed description" },
      },
      "rajeevyadav",
    );
    expect(JSON.stringify(md.title)).toContain("Reviewed title");
    expect(md.description).toBe("Reviewed description");
  });

  it("falls back to the generated fields when no override is set", () => {
    const md = buildProfileMetadata(
      { variant: "provider", profile: { ...base, meta_title: "Generated | kartsquare", meta_description: "generated" } },
      "rajeevyadav",
    );
    expect(JSON.stringify(md.title)).toContain("Generated | kartsquare");
    expect(md.description).toBe("generated");
  });
});
