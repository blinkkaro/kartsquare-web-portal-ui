import ScheduleView from "@/components/pages/Schedule";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule | KartSquare Portal",
  description: "Manage your schedule",
};

export default function Schedule() {
  return <ScheduleView />;
}
