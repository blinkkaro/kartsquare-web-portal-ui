import { seoAuth } from "@/lib/seo/buildMetadata";
import CustomerServiceBooking from "../../../../components/pages/customer/serviceBooking";

export const metadata = seoAuth({
  title: "Book service",
  description:
    "Confirm and complete your service booking on KartSquare — choose your time slot and pay securely.",
});

export default CustomerServiceBooking;

