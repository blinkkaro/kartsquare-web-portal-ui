import CookiePolicyView from "@/components/pages/cookiePolicy";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Cookie Policy | kartsquare",
  description:
    "Learn which cookies kartsquare uses for sign-in, analytics, and preferences — and how you can control them.",
  path: "/cookie-policy",
  keywords: [
    "kartsquare cookie policy",
    "cookie consent India",
    "website cookies",
    "analytics cookies",
  ],
});

export default function CookiePolicy() {
  return <CookiePolicyView />;
}
