import MainLayout from "./mainLayout";
import HomeView from "@/components/pages/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | KartSquare Portal",
  description: "Welcome to KartSquare Portal",
};

export default function Home() {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
}
