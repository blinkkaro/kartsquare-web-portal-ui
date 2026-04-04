import ReelsView from "@/components/pages/reels";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Reels",
  "Watch and explore short videos from KartSquare providers and suppliers.",
);

export default function ReelsPage() {
  return <ReelsView />;
}
