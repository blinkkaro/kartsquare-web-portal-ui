import { expect, test } from "@playwright/test";

/**
 * E2E pattern for the provider side: what a logged-out visitor can and cannot reach.
 * No credentials in e2e: test accounts live in the dev API's seed data and are passed through
 * environment variables, never written in a spec.
 */
test.describe("provider area, logged out", () => {
  test("the supplier login page renders a sign-in form", async ({ page }) => {
    await page.goto("/supplier/login");

    await expect(page.locator("input").first()).toBeVisible();
  });

  test("the provider dashboard is not indexable", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
