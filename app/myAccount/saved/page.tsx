import MainLayout from "@/app/mainLayout";
import SavedView from "@/components/pages/saved";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Saved items",
  "Products and services you have saved for later on KartSquare.",
);

export default function Saved() {
  return (
    <MainLayout>
      <SavedView />
    </MainLayout>
  );
}
