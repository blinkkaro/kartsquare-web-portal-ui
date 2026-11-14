/**
 * @jest-environment node
 */
describe("sitePageSeoOrFallback without an API URL", () => {
  it("returns the fallback without making a request", async () => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_API_URL;
    const fetchMock = jest.fn();
    (global as unknown as { fetch: typeof fetchMock }).fetch = fetchMock;
    const { sitePageSeoOrFallback } = await import("@/lib/seo/sitePageSeo");
    const fallback = { title: "fallback" };
    await expect(sitePageSeoOrFallback("store", fallback)).resolves.toBe(fallback);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
