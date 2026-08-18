import MainLayout from "@/app/mainLayout";
import FAQView from "@/components/pages/FAQ";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "FAQ",
  "Frequently asked questions about using kartsquare as a customer or provider.",
);

export default function FAQ() {
  return (
    <MainLayout>
      <FAQView />
    </MainLayout>
  );
}
