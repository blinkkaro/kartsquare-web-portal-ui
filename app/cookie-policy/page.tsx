import MainLayout from "@/app/mainLayout";
import CookiePolicyView from "@/components/pages/cookiePolicy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | KartSquare Portal",
  description: "Learn about how KartSquare uses cookies",
};

export default function CookiePolicyPage() {
  return (
    <MainLayout>
      <CookiePolicyView />
    </MainLayout>
  );
}
