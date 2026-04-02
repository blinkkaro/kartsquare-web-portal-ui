import MainLayout from "./mainLayout";
import HomeView from "@/components/pages/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | kartsquare Portal",
  description: "Welcome to the kartsquare Portal",
};

export default function Home() {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
}
