import MainLayout from "@/app/mainLayout";
import ContactUsView from "@/components/pages/contactUs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | kartsquare Portal",
  description: "Get in touch with us. We'd love to hear from you!",
};

export default function ContactUs() {
  return (
    <MainLayout>
      <ContactUsView />
    </MainLayout>
  );
}
