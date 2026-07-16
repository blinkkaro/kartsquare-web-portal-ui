import GlobalContactUsView from "@/components/pages/GlobalContactUs";
import { seoAuth } from "@/lib/seo/buildMetadata";

<<<<<<< HEAD
// noindex: this is a thin-content webview page for the mobile app.
// It has been removed from sitemap.xml and should not be indexed.
=======
>>>>>>> e9347cbdeae59e89bf4bcdecc623770407899d5e
export const metadata = seoAuth({
  title: "Contact Us | KartSquare",
  description:
    "Get in touch with the KartSquare team. Find answers to your questions, report issues, or send us a message directly.",
});

export default function GlobalContactUs() {
  return <GlobalContactUsView />;
}
