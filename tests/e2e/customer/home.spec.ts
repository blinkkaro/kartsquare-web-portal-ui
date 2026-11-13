import { expect, test } from "@playwright/test";

/**
 * E2E pattern: a real browser against a real build. Assert what a customer sees and can do.
 * Needs the API to answer. See docs/07-testing-strategy.md for the environment it expects.
 */
test.describe("customer home page", () => {
  test("loads with the Kartsquare title and a single h1", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Kartsquare/i);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("shows category icons and photos that actually loaded", async ({ page }) => {
    await page.goto("/");

    // Every <img> on the page must have decoded. A broken category photo shows up here.
    const images = page.locator("main img");
    await expect(images.first()).toBeVisible();
    const broken = await images.evaluateAll((els) =>
      els.filter((el) => !(el as HTMLImageElement).complete || (el as HTMLImageElement).naturalWidth === 0).length,
    );
    expect(broken).toBe(0);
  });
});
