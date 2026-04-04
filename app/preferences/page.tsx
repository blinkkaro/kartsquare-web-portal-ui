import PreferencesView from "@/components/pages/preferences";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata = seoPrivate({
  title: "Preferences",
  description:
    "Manage notification, language, and display preferences for your KartSquare account.",
});

export default function Preferences() {
  return <PreferencesView />;
}
