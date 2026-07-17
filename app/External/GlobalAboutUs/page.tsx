import GlobalAboutUsView from "@/components/pages/GlobalAboutUs";
import { seoAuth } from "@/lib/seo/buildMetadata";


export const metadata = seoAuth({
  title: "About Us | KartSquare",
  description:
    "Learn about KartSquare — India's fastest-growing marketplace connecting customers with verified local service providers.",
});

export default function GlobalAboutUs() {
  return <GlobalAboutUsView />;
}
