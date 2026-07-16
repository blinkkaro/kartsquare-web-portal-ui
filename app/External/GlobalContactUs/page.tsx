import GlobalContactUsView from "@/components/pages/GlobalContactUs";
import { seoAuth } from "@/lib/seo/buildMetadata";

// noindex: this is a thin-content webview page for the mobile app.
// It has been removed from sitemap.xml and should not be indexed.
export const metadata = seoAuth({
  title: "Contact Us | KartSquare",
  description:
    "Get in touch with the KartSquare team. Find answers to your questions, report issues, or send us a message directly.",
});

export default function GlobalContactUs() {
  return <GlobalContactUsView />;
}
