import MyAccountView from "@/components/pages/myAccount";
import MainLayout from "../mainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | KartSquare Portal",
  description: "Manage your KartSquare account",
};

export default function MyAccountPage() {
  return (
    <MainLayout>
      <MyAccountView />
    </MainLayout>
  );
}
