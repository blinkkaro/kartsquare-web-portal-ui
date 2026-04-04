import MainLayout from "../mainLayout";
import CareersView from "@/components/pages/careers";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Careers",
  description:
    "Explore career opportunities at KartSquare — build India's leading marketplace for products and professional services.",
  path: "/careers",
});

export default function Careers() {
  return (
    <MainLayout>
      <CareersView />
    </MainLayout>
  );
}
