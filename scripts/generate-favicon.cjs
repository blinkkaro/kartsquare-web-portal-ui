/**
 * Regenerates app/favicon.ico and public/icons/favicon-32x32.png + favicon-96x96.png from
 * public/web-app-manifest-192x192.png (update that asset when the brand mark changes).
 */
const fs = require("fs");
const path = require("path");
const png2icons = require("png2icons");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const srcPng = path.join(root, "public/web-app-manifest-192x192.png");

const input = fs.readFileSync(srcPng);
const ico = png2icons.createICO(input, png2icons.BILINEAR, 0, true, true);
if (!ico) {
  console.error("png2icons.createICO failed");
  process.exit(1);
}
fs.writeFileSync(path.join(root, "app/favicon.ico"), ico);
fs.mkdirSync(path.join(root, "public/icons"), { recursive: true });

(async () => {
  const iconsDir = path.join(root, "public/icons");
  await sharp(srcPng).resize(32, 32).png().toFile(path.join(iconsDir, "favicon-32x32.png"));
  await sharp(srcPng).resize(96, 96).png().toFile(path.join(iconsDir, "favicon-96x96.png"));
  console.log("Wrote app/favicon.ico, favicon-32x32.png, favicon-96x96.png");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
