import { NextResponse } from "next/server";

// iOS Universal Links. Set both env vars; until then the file is served empty
// so iOS simply ignores it.
// APPLE_TEAM_ID: Apple Developer Team ID (10 chars)
// IOS_BUNDLE_ID: RN iOS bundle identifier, e.g. com.kartsquare.app
export const dynamic = "force-static";

export function GET() {
  const teamId = process.env.APPLE_TEAM_ID;
  const bundleId = process.env.IOS_BUNDLE_ID || "com.kartsquare.app";
  const details = teamId
    ? [
        {
          appIDs: [`${teamId}.${bundleId}`],
          components: [
            // keep web-only/auth/legal pages in the browser
            { "/": "/api/*", exclude: true },
            { "/": "/_next/*", exclude: true },
            { "/": "/*" },
          ],
        },
      ]
    : [];
  return NextResponse.json(
    { applinks: { details } },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
