import JoinAsProviderView from "@/components/pages/JoinAsProvider";
import { seoAuth } from "@/lib/seo/buildMetadata";

// noindex: this is a thin-content webview page for the mobile app.
// It has been removed from sitemap.xml and should not be indexed.
export const metadata = seoAuth({
  title: "Join as a Service Provider | KartSquare",
  description:
    "Register your business on KartSquare and reach millions of customers across India.",
});

export default function JoinAsProvider() {
  return <JoinAsProviderView />;
}
