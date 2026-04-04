import MainLayout from "@/app/mainLayout";
import AddressView from "@/components/pages/address";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Saved addresses",
  "Manage delivery and service addresses for bookings and orders on KartSquare.",
);

export default function Address() {
  return (
    <MainLayout>
      <AddressView />
    </MainLayout>
  );
}
