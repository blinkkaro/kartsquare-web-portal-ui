import MainLayout from "@/app/mainLayout";
import BecomeServiceProviderView from "@/components/pages/becomeServiceProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Service Provider | KartSquare Portal",
  description: "Join KartSquare as a service provider and grow your business",
};

export default function BecomeServiceProviderPage() {
  return (
    <MainLayout>
      <BecomeServiceProviderView />
    </MainLayout>
  );
}
