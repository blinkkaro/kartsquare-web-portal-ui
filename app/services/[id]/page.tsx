import type { Metadata } from "next";
import CustomerServiceDetails from "../../../components/pages/customer/serviceDetails";
import { serviceListService } from "@/services/serviceList/serviceListService";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const service = await serviceListService.getServiceById(id);

    // Parse structured data if it exists as string or use object
    let structuredData = null;
    if (service.structured_data) {
      structuredData =
        typeof service.structured_data === "string"
          ? JSON.parse(service.structured_data)
          : service.structured_data;
    }

    return {
      title: service.meta_title || service.service_name,
      description: service.meta_description || service.service_desc,
      keywords: service.meta_keywords?.split(","),
      openGraph: {
        title: service.og_title || service.meta_title || service.service_name,
        description:
          service.og_description ||
          service.meta_description ||
          service.service_desc ||
          "",
        images: service.og_image ? [service.og_image] : service.image_urls,
      },
      other: {
        "script:ld+json": structuredData ? JSON.stringify(structuredData) : "",
      },
    };
  } catch (error) {
    return {
      title: "Service Details | Kartsquare",
      description: "Book professional services on Kartsquare",
    };
  }
}

export default CustomerServiceDetails;
