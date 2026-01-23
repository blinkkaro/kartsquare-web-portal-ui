import MainLayout from "@/app/mainLayout";
import FAQView from "@/components/pages/FAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | kartsquare Portal",
  description: "Frequently asked questions",
};

export default function FAQ() {
  return (
    <MainLayout>
      <FAQView />
    </MainLayout>
  );
}
