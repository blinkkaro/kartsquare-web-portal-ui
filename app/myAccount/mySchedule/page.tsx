import MainLayout from "@/app/mainLayout";
import MyScheduleView from "@/components/pages/mySchedule";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Schedule | kartsquare Portal",
  description: "Manage your working hours and schedule",
};

export default function MySchedule() {
  return (
    <MainLayout>
      <MyScheduleView />
    </MainLayout>
  );
}
