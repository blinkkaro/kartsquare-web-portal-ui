import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const titleRaw = searchParams.get("title") ?? "";
  const descRaw = searchParams.get("desc") ?? "";

  const heading = (titleRaw ? decodeURIComponent(titleRaw) : "KartSquare – B2B Marketplace").slice(0, 80);
  const sub = (descRaw ? decodeURIComponent(descRaw) : "Products & services from verified suppliers. Buy and book online.").slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0d0520 0%, #1a0a35 50%, #0a1628 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Purple glow top-left */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(136, 0, 255, 0.18)",
            filter: "blur(100px)",
          }}
        />
        {/* Cyan glow bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(0, 188, 255, 0.12)",
            filter: "blur(80px)",
          }}
        />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#8800ff",
              letterSpacing: "-0.5px",
            }}
          >
            KartSquare
          </div>
          <div
            style={{
              marginLeft: 14,
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid rgba(136,0,255,0.4)",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 1,
            }}
          >
            B2B MARKETPLACE
          </div>
        </div>

        {/* Page title */}
        <div
          style={{
            fontSize: heading.length > 50 ? 44 : 56,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 960,
            letterSpacing: "-1px",
          }}
        >
          {heading}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.5,
            maxWidth: 800,
            fontWeight: 400,
          }}
        >
          {sub}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.35)" }}>
            kartsquare.com
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
            <span>Verified Suppliers</span>
            <span>·</span>
            <span>Book Services</span>
            <span>·</span>
            <span>India's B2B Platform</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
