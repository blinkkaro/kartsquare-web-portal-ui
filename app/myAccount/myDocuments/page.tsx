import MainLayout from "@/app/mainLayout";
import MyDocumentsView from "@/components/pages/myDocuments";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "My documents",
  "Upload and track verification documents for your KartSquare profile.",
);

export default function MyDocuments() {
  return (
    <MainLayout>
      <MyDocumentsView />
    </MainLayout>
  );
}
