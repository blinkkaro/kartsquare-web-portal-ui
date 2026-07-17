import MainLayout from "@/app/mainLayout";
import ContactUsView from "@/components/pages/contactUs";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Contact KartSquare — Support, Partnerships & Enquiries",
  description:
    "Reach the KartSquare team for partnerships, support, press, or marketplace questions. We respond to business and customer enquiries promptly.",
  path: "/contact-us",
  keywords: [
    "KartSquare contact",
    "contact support India",
    "marketplace help",
    "business enquiry",
    "KartSquare helpdesk",
  ],
});

export default function ContactUs() {
  return (
    <MainLayout>
      <ContactUsView />
    </MainLayout>
  );
}
