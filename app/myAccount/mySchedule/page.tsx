import MainLayout from "@/app/mainLayout";
import MyScheduleView from "@/components/pages/mySchedule";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "My schedule",
  "View and manage your upcoming bookings and time slots on kartsquare.",
);

export default function MySchedule() {
  return (
    <MainLayout>
      <MyScheduleView />
    </MainLayout>
  );
}
