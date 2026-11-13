import React from "react";
import { pageTab } from "@/lib/seo/buildMetadata";
import SmtpSettings from "@/components/marketing-tools/email-marketing/SmtpSettings";

export const metadata = pageTab(
  "SMTP settings",
  "Configure your custom SMTP server to send email campaigns through your kartsquare supplier account.",
);



export default function SupplierSmtpSettingsPage() {
  return <SmtpSettings role="supplier" />;
}
