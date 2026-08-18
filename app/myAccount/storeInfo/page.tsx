import MainLayout from "@/app/mainLayout";
import StoreInfoView from "@/components/pages/storeInfo";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Store information",
  "Edit your supplier store name, branding, and business details on kartsquare.",
);

export default function StoreInfo() {
  return (
    <MainLayout>
      <StoreInfoView />
    </MainLayout>
  );
}
