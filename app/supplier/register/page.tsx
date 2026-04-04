import MainLayout from "@/app/mainLayout";
import BecomeServiceProviderView from "@/components/pages/becomeServiceProvider";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Become a service provider",
  description:
    "Join KartSquare as a verified service provider — list services, get bookings, and grow your business on India's marketplace.",
});

export default function BecomeServiceProviderPage() {
  return (
    <MainLayout>
      <BecomeServiceProviderView />
    </MainLayout>
  );
}
