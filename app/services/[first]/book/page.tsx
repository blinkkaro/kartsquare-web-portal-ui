import { seoAuth } from "@/lib/seo/buildMetadata";
import CustomerServiceBooking from "../../../../components/pages/customer/serviceBooking";

export const metadata = seoAuth({
  title: "Book service",
  description:
    "Confirm and complete your service booking on kartsquare — choose a time and send your request. You pay only after the service is done.",
});

export default CustomerServiceBooking;
