import ScheduleView from "@/components/pages/Schedule";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata = seoPrivate({
  title: "Availability schedule",
  description:
    "Set when you are available for bookings so customers can reserve the right time slots on kartsquare.",
});

export default function Schedule() {
  return <ScheduleView />;
}
