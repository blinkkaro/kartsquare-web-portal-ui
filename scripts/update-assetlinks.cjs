#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/update-assetlinks.cjs \
 *     --keystore ./android/app/release.keystore \
 *     --alias kartsquare \
 *     --package com.kartsquare.app
 *
 * Requires: keytool (comes with JDK)
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const keystore = get("--keystore");
const alias = get("--alias");
const packageName = get("--package") || "com.kartsquare.app";

if (!keystore || !alias) {
  console.error("Usage: node scripts/update-assetlinks.cjs --keystore <path> --alias <alias> [--package <packageName>]");
  process.exit(1);
}

let output;
try {
  output = execSync(
    `keytool -list -v -keystore "${keystore}" -alias "${alias}" -storepass android 2>&1`,
    { encoding: "utf8" }
  );
} catch (e) {
  // keytool exits non-zero when prompting for password — capture stdout anyway
  output = e.stdout || e.message;
}

const match = output.match(/SHA256:\s*([A-F0-9:]{95})/i);
if (!match) {
  console.error("Could not extract SHA256 fingerprint. Run manually:\n  keytool -list -v -keystore <path> -alias <alias>");
  console.error("Output was:\n", output);
  process.exit(1);
}

const fingerprint = match[1].toUpperCase();
const assetlinksPath = path.join(__dirname, "../public/.well-known/assetlinks.json");

const json = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: packageName,
      sha256_cert_fingerprints: [fingerprint],
    },
  },
];

fs.writeFileSync(assetlinksPath, JSON.stringify(json, null, 2) + "\n");
console.log(`✅ assetlinks.json updated`);
console.log(`   package_name: ${packageName}`);
console.log(`   SHA256: ${fingerprint}`);
