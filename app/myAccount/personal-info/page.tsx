import MainLayout from "@/app/mainLayout";
import PersonalInfoView from "@/components/pages/personalInfo";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Personal information",
  "Update your name, photo, username, and contact details visible on kartsquare.",
);

export default function PersonalInfo() {
  return (
    <MainLayout>
      <PersonalInfoView />
    </MainLayout>
  );
}
