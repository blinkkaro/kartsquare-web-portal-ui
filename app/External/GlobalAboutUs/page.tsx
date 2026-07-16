import GlobalAboutUsView from "@/components/pages/GlobalAboutUs";
import { seoAuth } from "@/lib/seo/buildMetadata";

// noindex: this is a thin-content webview page for the mobile app.
// It has been removed from sitemap.xml and should not be indexed.
export const metadata = seoAuth({
  title: "About Us | KartSquare",
  description:
    "Learn about KartSquare — India's fastest-growing marketplace connecting customers with verified local service providers.",
});

export default function GlobalAboutUs() {
  return <GlobalAboutUsView />;
}
