import PreferencesView from "@/components/pages/preferences";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preferences | KartSquare Portal",
  description: "Set your account preferences",
};

export default function Preferences() {
  return <PreferencesView />;
}
