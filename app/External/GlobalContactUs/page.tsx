import GlobalContactUsView from "@/components/pages/GlobalContactUs";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Contact Us | KartSquare",
  description:
    "Get in touch with the KartSquare team. Find answers to your questions, report issues, or send us a message directly.",
  path: "/External/GlobalContactUs",
});

export default function GlobalContactUs() {
  return <GlobalContactUsView />;
}
