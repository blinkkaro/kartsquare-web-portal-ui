import MainLayout from "@/app/mainLayout";
import CareersView from "@/components/pages/careers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | KartSquare Portal",
  description: "Join the KartSquare team and build your career with us",
};

export default function CareersPage() {
  return (
    <MainLayout>
      <CareersView />
    </MainLayout>
  );
}
