import MainLayout from "@/app/mainLayout";
import MyDocumentsView from "@/components/pages/myDocuments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Documents | KartSquare Portal",
  description: "Manage your uploaded documents",
};

export default function MyDocuments() {
  return (
    <MainLayout>
      <MyDocumentsView />
    </MainLayout>
  );
}
