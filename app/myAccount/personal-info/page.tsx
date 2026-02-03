import MainLayout from "@/app/mainLayout";
import PersonalInfoView from "@/components/pages/personalInfo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Info | kartsquare Portal",
  description: "View and edit your personal information",
};

export default function PersonalInfo() {
  return (
    <MainLayout>
      <PersonalInfoView />
    </MainLayout>
  );
}
