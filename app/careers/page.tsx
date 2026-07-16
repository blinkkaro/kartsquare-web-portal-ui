import MainLayout from "../mainLayout";
import CareersView from "@/components/pages/careers";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Careers at KartSquare — Jobs in India's B2B Marketplace",
  description:
    "Explore career opportunities at KartSquare — build India's leading marketplace for products and professional services. Join our growing team.",
  path: "/careers",
  keywords: [
    "KartSquare careers",
    "jobs India marketplace",
    "startup jobs Jaipur",
    "B2B company jobs",
    "tech jobs India",
  ],
});

export default function Careers() {
  return (
    <MainLayout>
      <CareersView />
    </MainLayout>
  );
}
