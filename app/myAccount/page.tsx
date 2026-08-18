import MainLayout from "@/app/mainLayout";
import MyAccountView from "@/components/pages/myAccount";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "My account",
  "Overview of your kartsquare profile, shortcuts, and account activity.",
);

export default function MyAccount() {
  return (
    <MainLayout>
      <MyAccountView />
    </MainLayout>
  );
}
