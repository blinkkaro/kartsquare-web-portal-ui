import { Service } from "@/services/serviceList/listInteraface";

export interface ProviderRecentWork {
  id: string;
  title: string;
  image: string;
  type: "image" | "reel";
  caption?: string;
}

export interface EnrichedServiceItem extends Service {
  recent_works?: ProviderRecentWork[];
  sub_services?: string[];
  is_verified?: boolean;
  distance_km?: number | null;
  /** The user's GPS fix was coarse (> 500 m), so the distance is approximate. */
  distance_approx?: boolean;
  /** Google Maps directions to the provider (from the user's GPS when known); null = none. */
  directions_url?: string | null;
  starting_price_label?: string;
  /** Name of the area the provider is in, when the backend knows it. */
  area_name?: string;
  landmark_name?: string;
}

/**
 * Maps real backend provider/service data into EnrichedServiceItem without any sample fallback
 */
export const mapRealServiceToEnriched = (s: Service): EnrichedServiceItem => {
  const displayName =
    s.business_name || s.service_name || s.provider_name || "Local service";
  const providerName = s.provider_name || s.business_name || displayName;

  // Extract sub services from real sub_category_name, price_items, or category_name
  const subServices: string[] = [];
  if (Array.isArray(s.sub_category_name)) {
    s.sub_category_name.forEach((sub) => {
      if (sub && typeof sub === "string" && !subServices.includes(sub.trim())) {
        subServices.push(sub.trim());
      }
    });
  }
  if (Array.isArray(s.price_items)) {
    s.price_items.forEach((item) => {
      if (item?.service_name && !subServices.includes(item.service_name.trim())) {
        subServices.push(item.service_name.trim());
      }
    });
  }
  if (subServices.length === 0 && Array.isArray(s.category_name)) {
    s.category_name.forEach((cat) => {
      if (cat && typeof cat === "string" && !subServices.includes(cat.trim())) {
        subServices.push(cat.trim());
      }
    });
  }

  // Media extraction (from real S3 / Cloudinary URLs)
  const images: string[] = Array.isArray(s.image_urls) ? s.image_urls.filter(Boolean) : [];
  if (images.length === 0 && s.provider_image_url) {
    images.push(s.provider_image_url);
  }

  // Build recent works directly from provider's real photos and price items
  const recentWorks: ProviderRecentWork[] = images.slice(0, 4).map((img, idx) => {
    const priceItem = s.price_items?.[idx];
    const workTitle =
      priceItem?.service_name ||
      subServices[idx] ||
      (idx === 0 ? "Featured work" : idx === 1 ? "Recent project" : "On-site service");
    const caption =
      priceItem?.service_desc ||
      (s.service_desc ? s.service_desc.slice(0, 140) : `Service delivered by ${displayName}`);

    return {
      id: `${s.service_id}-work-${idx}`,
      title: workTitle,
      image: img,
      type: "image",
      caption,
    };
  });

  // Calculate price dynamically from price_items or visiting charge or base price
  let computedPrice: number | null = null;
  let priceLabel = "Contact for price";
  let isPriceRequired = Boolean(s.is_price_required);

  if (Array.isArray(s.price_items) && s.price_items.length > 0) {
    const validItemPrices = s.price_items
      .map((pi) => Number(pi.price))
      .filter((pr) => !isNaN(pr) && pr > 0);
    if (validItemPrices.length > 0) {
      computedPrice = Math.min(...validItemPrices);
      priceLabel = "Starting from";
      isPriceRequired = true;
    }
  }

  if (computedPrice === null && s.price && Number(s.price) > 0) {
    computedPrice = Number(s.price);
    priceLabel = "Fixed price";
    isPriceRequired = true;
  }

  if (computedPrice === null && s.visiting_charge && Number(s.visiting_charge) > 0) {
    computedPrice = Number(s.visiting_charge);
    priceLabel = "Visiting fee";
    isPriceRequired = true;
  }

  // Real values only: avg_service_rating defaults to 4.00 in the DB, so a
  // rating is shown only once review_count > 0 (the cards check that).
  const rating = Number(s.avg_service_rating) || 0;
  const reviews = Number(s.review_count) || 0;

  return {
    ...s,
    business_name: displayName,
    provider_name: providerName,
    image_urls: images,
    provider_image_url: s.provider_image_url || images[0] || "",
    price: computedPrice,
    is_price_required: isPriceRequired,
    starting_price_label: priceLabel,
    avg_service_rating: rating,
    review_count: reviews,
    // The public list only returns services Kartsquare has approved.
    is_verified: true,
    landmark_name: s.service_address?.landmark || undefined,
    sub_services: subServices,
    recent_works: recentWorks,
  };
};

export const RELATED_CATEGORIES_FOR_EMPTY = [
  { name: "Home deep cleaning", path: "/cus/services-list?search=cleaning" },
  { name: "Plumbers", path: "/cus/services-list?search=plumber" },
  { name: "Bathroom cleaning", path: "/cus/services-list?search=bathroom" },
  { name: "AC Repair", path: "/cus/services-list?search=ac" },
];
