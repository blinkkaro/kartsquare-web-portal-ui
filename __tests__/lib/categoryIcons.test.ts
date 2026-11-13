/**
 * Category icons are drawn from data/categoryIcons.json, bundled into the frontend,
 * so the app never fetches an icon from Iconify's servers.
 *
 * __tests__/fixtures/category-icon-names.json is every icon name the database held on
 * 2026-11-10 (categories, sub_categories, product_categories, product_sub_categories,
 * user_preferences). When categories get new icons, add their names there and run
 * `npm run icons:category -- <names>`.
 */
import fs from "fs";
import path from "path";
import { categoryIconData, DEFAULT_CATEGORY_ICON, isBundledCategoryIcon } from "@/lib/categoryIcons";
import BUNDLE from "@/data/categoryIcons.json";
import DB_ICON_NAMES from "../fixtures/category-icon-names.json";

const root = path.join(__dirname, "..", "..");
const bodyOf = (name: string) => (BUNDLE.icons as Record<string, { body: string }>)[name.slice(3)].body;

describe("bundled category icons", () => {
  it("has a drawing for every icon name the database uses", () => {
    const missing = (DB_ICON_NAMES as string[]).filter((n) => !isBundledCategoryIcon(n));
    expect(missing).toEqual([]);
  });

  it("includes the default icon", () => {
    expect(isBundledCategoryIcon(DEFAULT_CATEGORY_ICON)).toBe(true);
  });

  it("returns the icon's own drawing, sized 256×256", () => {
    const data = categoryIconData("ph:tractor-duotone");
    expect(data).toEqual({ body: bodyOf("ph:tractor-duotone"), width: 256, height: 256 });
    expect(data.body).toMatch(/<path /);
  });

  it.each([
    ["no icon", null],
    ["an empty value", ""],
    ["a name that is not bundled", "ph:rocket-launch-duotone-nope"],
    ["another icon set", "mdi:tractor"],
    ["an old SVG file URL", "https://kartsquare.com/category-icons/service/automotive.svg"],
    ["a built-in object property name", "ph:constructor"],
    ["a prototype key", "ph:__proto__"],
  ])("falls back to the default icon for %s", (_what, value) => {
    expect(categoryIconData(value).body).toBe(bodyOf(DEFAULT_CATEGORY_ICON));
  });

  it("every bundled drawing is complete (no aliases left to resolve)", () => {
    for (const [name, icon] of Object.entries(BUNDLE.icons as Record<string, { body?: string; parent?: string }>)) {
      expect({ name, ok: typeof icon.body === "string" && icon.body.includes("<path") && !icon.parent }).toEqual({ name, ok: true });
    }
  });

  it("stays small: under 400 KB on disk", () => {
    const size = fs.statSync(path.join(root, "data", "categoryIcons.json")).size;
    expect(size).toBeLessThan(400 * 1024);
  });

  it("CategoryIcon draws from the bundled data, never by name (a name would make the library fetch it)", () => {
    const src = fs.readFileSync(path.join(root, "components", "common", "CategoryIcon.tsx"), "utf8");
    expect(src).toMatch(/<Icon icon=\{categoryIconData\(icon\)\}/);
    expect(src).not.toMatch(/<Icon icon=\{["'`]|<Icon icon="/);
  });
});
