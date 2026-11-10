import type { IconifyIcon } from "@iconify/react";
import CATEGORY_ICONS from "@/data/categoryIcons.json";

/** Shown when a category has no icon name, or one that is not in the bundled set. */
export const DEFAULT_CATEGORY_ICON = "ph:squares-four-duotone";

/**
 * The drawings of the icons the categories use, bundled into the frontend
 * (data/categoryIcons.json, built by `npm run icons:category`), so no icon is ever
 * fetched from Iconify's servers. A name missing from the bundle gets the default icon.
 */
const BUNDLED: Record<string, { body: string }> = CATEGORY_ICONS.icons;

/** Whether "ph:<name>" is in the bundled set. */
export const isBundledCategoryIcon = (icon?: string | null): boolean =>
  // Own keys only: "ph:constructor" or "ph:__proto__" must not match Object's built-ins.
  Boolean(icon?.startsWith("ph:") && Object.prototype.hasOwnProperty.call(BUNDLED, icon.slice(3)));

/** The bundled drawing for "ph:<name>", or the default icon's. */
export const categoryIconData = (icon?: string | null): IconifyIcon => {
  const name = isBundledCategoryIcon(icon) ? icon!.slice(3) : DEFAULT_CATEGORY_ICON.slice(3);
  return { body: BUNDLED[name].body, width: CATEGORY_ICONS.width, height: CATEGORY_ICONS.height };
};
