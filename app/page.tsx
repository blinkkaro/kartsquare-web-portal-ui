import MainLayout from "./mainLayout";
import HomeView from "@/components/pages/home";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "KartSquare – B2B marketplace & local services",
  description:
    "KartSquare connects you with verified suppliers, technicians, and service providers across India — from home repairs and cleaning to industrial supplies and wholesale products. Book services and discover businesses you can trust.",
  path: "/",
  keywords: [
    "KartSquare",
    "B2B marketplace India",
    "book services online",
    "verified suppliers",
    "home services India",
    "Jaipur technicians",
    "wholesale products India",
  ],
});

export default function Home() {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
}
