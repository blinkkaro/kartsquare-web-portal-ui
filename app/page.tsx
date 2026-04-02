import MainLayout from "./mainLayout";
import HomeView from "@/components/pages/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kartsquare – Discover Automotive Services & Products",
  description:
    "Explore Kartsquare to find trusted automotive services, products, and businesses near you. Connect with workshops, dealers, and service providers easily.",
};

export default function Home() {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
}
