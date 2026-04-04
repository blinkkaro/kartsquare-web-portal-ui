import MainLayout from "@/app/mainLayout";
import ContactUsView from "@/components/pages/contactUs";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Contact us",
  description:
    "Reach the KartSquare team for partnerships, support, press, or marketplace questions. We respond to business and customer enquiries.",
  path: "/contactUs",
});

export default function ContactUs() {
  return (
    <MainLayout>
      <ContactUsView />
    </MainLayout>
  );
}
