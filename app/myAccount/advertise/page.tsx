import MainLayout from "@/app/mainLayout";
import AdvertiseView from "@/components/pages/advertise";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Advertise",
  "Promote your brand and reach more buyers and service customers on kartsquare.",
);

export default function Advertise() {
  return (
    <MainLayout>
      <AdvertiseView />
    </MainLayout>
  );
}
