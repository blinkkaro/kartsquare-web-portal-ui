import CookiePolicyView from "@/components/pages/cookiePolicy";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Cookie Policy",
  description:
    "Learn which cookies KartSquare uses for sign-in, analytics, and preferences — and how you can control them.",
  path: "/cookie-policy",
});

export default function CookiePolicy() {
  return <CookiePolicyView />;
}
