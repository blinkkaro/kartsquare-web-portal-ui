import MainLayout from "@/app/mainLayout";
import MyPreferencesView from "@/components/pages/myPreferences";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Preferences",
  "Customize categories, notifications, and content preferences on kartsquare.",
);

export default function MyPreferences() {
  return (
    <MainLayout>
      <MyPreferencesView />
    </MainLayout>
  );
}
