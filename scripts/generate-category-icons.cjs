#!/usr/bin/env node
/**
 * Builds data/categoryIcons.json: the drawings of the Phosphor icons the categories use,
 * bundled into the frontend so CategoryIcon never fetches from Iconify's servers.
 *
 * The icon names come from the existing data/categoryIcons.json plus any names passed on
 * the command line, so adding a category icon is:
 *
 *   npm run icons:category -- ph:rocket-duotone ph:cake-duotone
 *
 * Only Phosphor ("ph:") names are accepted. Aliases are resolved, so every entry is a
 * complete drawing. The icon set comes from the @iconify-json/ph dev dependency.
 */
const fs = require("fs");
const path = require("path");
const { getIconData } = require("@iconify/utils");
const ph = require("@iconify-json/ph/icons.json");

const OUT = path.join(__dirname, "..", "data", "categoryIcons.json");
const DEFAULT_ICON = "ph:squares-four-duotone";

const existing = fs.existsSync(OUT) ? Object.keys(JSON.parse(fs.readFileSync(OUT, "utf8")).icons).map((n) => `ph:${n}`) : [];
const wanted = [...new Set([DEFAULT_ICON, ...existing, ...process.argv.slice(2)])].sort();

const icons = {};
const missing = [];
for (const full of wanted) {
  const [prefix, name] = full.split(":");
  const data = prefix === "ph" && name ? getIconData(ph, name) : null;
  if (!data) {
    missing.push(full);
    continue;
  }
  // Phosphor icons are all 256×256, so only the drawing is kept.
  if ((data.width ?? ph.width) !== 256 || (data.height ?? ph.height) !== 256) {
    throw new Error(`${full} is not 256×256; CategoryIcon assumes it is`);
  }
  icons[name] = { body: data.body };
}

if (missing.length) {
  console.error(`Not found in the Phosphor set: ${missing.join(", ")}`);
  process.exit(1);
}

fs.writeFileSync(OUT, `${JSON.stringify({ prefix: "ph", width: 256, height: 256, icons })}\n`);
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`Wrote ${Object.keys(icons).length} icons to data/categoryIcons.json (${kb} KB)`);
