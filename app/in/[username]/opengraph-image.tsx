import { ImageResponse } from "next/og";
import { fetchPublicProfileForSeo } from "@/lib/seo/publicProfile";
import { COLORS } from "@/constants/colors";

export const alt = "KartSquare Verified Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Edge runtime is recommended for OG image generation
export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  
  // Fetch profile data
  const payload = await fetchPublicProfileForSeo(username);
  
  if (!payload) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #5E18E9 0%, #36009E 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 64,
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          KartSquare Profile
        </div>
      ),
      { ...size }
    );
  }

  const { profile, variant } = payload;
  const isSupplier = variant === "supplier";
  
  // Extract display name
  const store = profile.store_name as string;
  const biz = profile.business_name as string;
  const first = (profile.first_name as string) || "";
  const last = (profile.last_name as string) || "";
  const personName = `${first} ${last}`.trim();
  
  const displayName = isSupplier ? store || personName : biz || personName || username;
  
  const profilePic = (profile.profile_pic || profile.logo_url) as string | undefined;
  
  // Define a rich gradient background
  const bgGradient = "linear-gradient(165deg, #111118 0%, #1a1a24 50%, #2a1548 100%)";
  
  return new ImageResponse(
    (
      <div
        style={{
          background: bgGradient,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "60px 80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header - Logo / Brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              background: "#5E18E9",
              padding: "10px 24px",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "white" }}>Kart</span>
            <span style={{ color: "#E0C8FF" }}>Square</span>
          </div>
          <div style={{ marginLeft: 24, fontSize: 24, color: "#8b8b9b", fontWeight: 500 }}>
            Verified {isSupplier ? "Supplier" : "Service Provider"}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "auto", marginBottom: "auto" }}>
          {profilePic ? (
            <div
              style={{
                display: "flex",
                width: 200,
                height: 200,
                borderRadius: 100,
                overflow: "hidden",
                marginRight: 48,
                border: "4px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profilePic} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 200,
                borderRadius: 100,
                background: "rgba(94, 24, 233, 0.2)",
                marginRight: 48,
                border: "4px solid rgba(94, 24, 233, 0.4)",
                fontSize: 72,
                fontWeight: 800,
                color: "#5E18E9",
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                margin: 0,
                marginBottom: 16,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "white",
              }}
            >
              {displayName}
            </h1>
            <p
              style={{
                fontSize: 32,
                margin: 0,
                color: "#a1a1aa",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {(profile.tagline as string) || (profile.bio as string) || `View ${displayName}'s profile and offerings on KartSquare.`}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 40,
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 24, color: "#a1a1aa" }}>
            kartsquare.com/in/{username}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.1)",
              padding: "12px 24px",
              borderRadius: 32,
              fontSize: 24,
              color: "white",
              fontWeight: 600,
            }}
          >
            Explore Profile →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
