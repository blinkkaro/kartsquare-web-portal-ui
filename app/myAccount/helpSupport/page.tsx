import MainLayout from "@/app/mainLayout";
import HelpSupportView from "@/components/pages/helpSupport";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support | KartSquare Portal",
  description: "Get help and support",
};

export default function HelpSupport() {
  return (
    <MainLayout>
      <HelpSupportView />
    </MainLayout>
  );
}
