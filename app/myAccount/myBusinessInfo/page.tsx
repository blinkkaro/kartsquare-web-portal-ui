import MainLayout from "@/app/mainLayout";
import MyBusinessInfoView from "@/components/pages/myBusinessInfo";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Business profile",
  "Update your business description, categories, and public profile details.",
);

export default function MyBusinessInfo() {
  return (
    <MainLayout>
      <MyBusinessInfoView />
    </MainLayout>
  );
}
