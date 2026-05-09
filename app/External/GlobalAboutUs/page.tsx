import GlobalAboutUsView from "@/components/pages/GlobalAboutUs";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "About Us | KartSquare",
  description:
    "Learn about KartSquare — India's fastest-growing marketplace connecting customers with verified local service providers.",
  path: "/External/GlobalAboutUs",
});

export default function GlobalAboutUs() {
  return <GlobalAboutUsView />;
}
