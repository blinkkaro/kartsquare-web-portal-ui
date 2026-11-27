import { expect, test } from "@playwright/test";

/**
 * A service provider who lands on the customer login page is sent to the business listing,
 * which is where provider sign-up starts (WhatsApp OTP first).
 */
test.describe("customer login page, provider sign-up option", () => {
  test("shows the highlighted option and opens the business listing page", async ({ page }) => {
    await page.goto("/login?role=customer");

    const option = page.getByRole("region", { name: "Are you a service provider?" });
    await expect(option).toBeVisible();

    await option.getByRole("link", { name: "List your business" }).click();
    await expect(page).toHaveURL(/\/business-listing$/);
  });
});
