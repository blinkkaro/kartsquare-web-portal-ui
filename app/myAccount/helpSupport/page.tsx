import MainLayout from "@/app/mainLayout";
import HelpSupportView from "@/components/pages/helpSupport";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Help & support",
  "Get answers about bookings, payments, listings, and KartSquare account issues.",
);

export default function HelpSupport() {
  return (
    <MainLayout>
      <HelpSupportView />
    </MainLayout>
  );
}
