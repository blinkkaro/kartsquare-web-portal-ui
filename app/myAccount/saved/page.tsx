import MainLayout from "@/app/mainLayout";
import SavedView from "@/components/pages/saved";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved | kartsquare Portal",
  description: "View your saved items",
};

export default function Saved() {
  return (
    <MainLayout>
      <SavedView />
    </MainLayout>
  );
}
