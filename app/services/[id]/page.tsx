import type { Metadata } from "next";
import CustomerServiceDetails from "../../../components/pages/customer/serviceDetails";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { SITE_URL } from "@/lib/seo/buildMetadata";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parseStructured(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      const o = JSON.parse(raw) as unknown;
      if (typeof o === "object" && o !== null) return o as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const base = SITE_URL;

  try {
    const service = await serviceListService.getServiceById(id);
    const path = `/services/${service.slug || service.service_id || id}`;
    const canonical = `${base}${path}`;
    const titleText =
      service.meta_title ||
      `${service.service_name || "Service"} | KartSquare`;
    const desc =
      service.meta_description ||
      service.service_desc ||
      `Book ${service.service_name || "this service"} on KartSquare with verified providers and clear pricing.`;
    const ogTitle =
      service.og_title || service.meta_title || service.service_name || titleText;
    const ogDesc =
      service.og_description ||
      service.meta_description ||
      service.service_desc ||
      desc;
    const images = service.og_image
      ? [service.og_image]
      : service.image_urls?.length
        ? service.image_urls
        : [];

    return {
      title: { absolute: titleText },
      description: desc,
      keywords: service.meta_keywords
        ? service.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : undefined,
      alternates: { canonical },
      openGraph: {
        title: ogTitle,
        description: ogDesc,
        url: canonical,
        siteName: "KartSquare",
        type: "website",
        locale: "en_IN",
        ...(images.length ? { images: images.map((url) => ({ url })) } : {}),
      },
      twitter: {
        card: images.length ? "summary_large_image" : "summary",
        title: ogTitle,
        description: ogDesc,
        ...(images.length ? { images } : {}),
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return {
      title: { absolute: "Service details | KartSquare" },
      description:
        "Browse and book professional services from verified providers on KartSquare.",
      robots: { index: false, follow: true },
    };
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let jsonLd: string | null = null;
  try {
    const service = await serviceListService.getServiceById(id);
    const structured = parseStructured(service.structured_data);
    const canonical = `${SITE_URL}/services/${service.slug || service.service_id || id}`;
    const node =
      structured
        ? { ...structured, url: canonical, "@context": structured["@context"] || "https://schema.org" }
        : {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.service_name,
            description: service.service_desc || service.meta_description,
            url: canonical,
            provider: service.business_name
              ? { "@type": "LocalBusiness", name: service.business_name }
              : undefined,
          };
    jsonLd = JSON.stringify(node);
  } catch {
    jsonLd = null;
  }

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ) : null}
      <CustomerServiceDetails />
    </>
  );
}
