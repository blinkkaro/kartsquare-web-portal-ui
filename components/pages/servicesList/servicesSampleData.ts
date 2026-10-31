import { HOME_PHOTOS } from "@/components/pages/home/sections/homePhotos";
import { Service, ServiceStatus, BookingLocationType, PricingType } from "@/services/serviceList/listInteraface";
import { resolveMainArea, ResolvedLocation } from "@/utils/mainAreaResolver";

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
  starting_price_label?: string;
  area_name?: string;
  landmark_name?: string;
  resolved_location?: ResolvedLocation;
}

/**
 * Maps real backend provider/service data into EnrichedServiceItem without any sample fallback
 */
export const mapRealServiceToEnriched = (s: Service): EnrichedServiceItem => {
  const displayName =
    s.business_name || s.service_name || s.provider_name || "Verified Service";
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
  if (subServices.length === 0) {
    subServices.push("Verified professional", "Doorstep service");
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

  // Resolve canonical main area (Justdial style: Jhotwara, Vaishali Nagar, Mansarovar, etc.)
  const resolved = resolveMainArea(s.service_address, s.service_address?.city_town || "Jaipur");
  const area_name = resolved.mainArea;
  const landmark_name = resolved.landmark;

  const rating = Number(s.avg_service_rating) || 4.5;
  const reviews = typeof s.review_count === "number" ? s.review_count : 0;

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
    is_verified: true,
    area_name,
    landmark_name,
    resolved_location: resolved,
    sub_services: subServices,
    recent_works: recentWorks,
  };
};

export const SAMPLE_SERVICES_ELECTRICIANS: EnrichedServiceItem[] = [
  {
    service_id: "sample-elec-1",
    provider_id: "prov-sharma-electric",
    category_id: "cat-electrician",
    sub_category_id: "sub-wiring",
    service_name: "Complete Home Electrical & Inverter Repair",
    business_name: "Sharma Electric Works",
    provider_name: "Ramesh Sharma",
    service_desc: "Specialized in 3BHK residential wiring, MCB distribution board installation, inverter repair, earthing, and architectural lighting solutions.",
    image_urls: [HOME_PHOTOS.electricianHero.src, HOME_PHOTOS.electricianBox.src],
    is_price_required: true,
    price: 199,
    currency: "INR",
    service_at_location: BookingLocationType.AT_CUSTOMER,
    visiting_charge: 149,
    service_provider_address_id: "addr-1",
    service_radius: 15,
    has_service_duration: true,
    service_duration: 60,
    have_slots: true,
    avg_service_rating: 4.8,
    review_count: 126,
    status: ServiceStatus.ACTIVE,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    is_deleted: false,
    provider_phone_number: "+91 98290 12345",
    provider_whatsapp_country_code: "+91",
    provider_whatsapp_number: "9829012345",
    category_name: ["Electrician", "Home Services"],
    sub_category_name: ["House wiring", "Inverter repair", "MCB & switchboards"],
    sub_services: ["House wiring", "Inverter repair", "MCB & switchboards"],
    service_provider_address: "Shop 14, Main Market, Mansarovar, Jaipur",
    service_address: {
      building_no: "14",
      floor: "Ground",
      address: "Main Market, Mansarovar",
      landmark: "Near Metro Pillar 84",
      pincode: "302020",
      city_town: "Jaipur",
      state: "Rajasthan",
      latitude: 26.8532,
      longitude: 75.7681,
      country: "India",
    },
    provider_image_url: HOME_PHOTOS.electricianHero.src,
    pricing_type: PricingType.SINGLE,
    slug: "sharma-electric-works-mansarovar",
    is_verified: true,
    starting_price_label: "Starting from",
    area_name: "Mansarovar",
    recent_works: [
      {
        id: "work-1",
        title: "Full panel rewiring, 3BHK",
        image: HOME_PHOTOS.electricianPanel.src,
        type: "image",
        caption: "Upgraded outdated porcelain fuse system to a fire-safe 8-way distribution board with RCCB protection.",
      },
      {
        id: "work-2",
        title: "L-junction conduit piping",
        image: HOME_PHOTOS.electricianBox.src,
        type: "image",
        caption: "Concealed wiring setup with high-grade copper wires for false ceiling warm ambient spots.",
      },
      {
        id: "work-3",
        title: "Inverter battery setup",
        image: HOME_PHOTOS.electricianHero.src,
        type: "image",
        caption: "Installed a dual-battery sine wave inverter system with neat wall mount casing.",
      },
    ],
  },
  {
    service_id: "sample-elec-2",
    provider_id: "prov-brightline-elec",
    category_id: "cat-electrician",
    sub_category_id: "sub-society",
    service_name: "Industrial & Society Electrical Contractor",
    business_name: "BrightLine Electricals",
    provider_name: "Vikram Rathore",
    service_desc: "Govt-approved electrical contractors for residential societies, commercial complexes, transformer maintenance, and earthing audits.",
    image_urls: [HOME_PHOTOS.electricianBox.src, HOME_PHOTOS.electricianPanel.src],
    is_price_required: false,
    price: null,
    currency: "INR",
    service_at_location: BookingLocationType.AT_CUSTOMER,
    visiting_charge: null,
    service_provider_address_id: "addr-2",
    service_radius: 25,
    has_service_duration: false,
    service_duration: null,
    have_slots: true,
    avg_service_rating: 4.7,
    review_count: 91,
    status: ServiceStatus.ACTIVE,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    is_deleted: false,
    provider_phone_number: "+91 94140 54321",
    provider_whatsapp_country_code: "+91",
    provider_whatsapp_number: "9414054321",
    category_name: ["Electrician", "Commercial Electrical"],
    sub_category_name: ["Society maintenance", "MCB & switchboards", "Earthing"],
    sub_services: ["Society maintenance", "MCB & switchboards", "Earthing"],
    service_provider_address: "Plot 42, Queens Road, Vaishali Nagar, Jaipur",
    service_address: {
      building_no: "42",
      floor: "1st Floor",
      address: "Queens Road, Vaishali Nagar",
      landmark: "Opposite National Handloom",
      pincode: "302021",
      city_town: "Jaipur",
      state: "Rajasthan",
      latitude: 26.9024,
      longitude: 75.7448,
      country: "India",
    },
    provider_image_url: HOME_PHOTOS.electricianBox.src,
    pricing_type: PricingType.NOPRICE,
    slug: "brightline-electricals-vaishali-nagar",
    is_verified: true,
    starting_price_label: "Contact for price",
    area_name: "Vaishali Nagar",
    recent_works: [
      {
        id: "work-4",
        title: "Society DB maintenance",
        image: HOME_PHOTOS.electricianPanel.src,
        type: "image",
        caption: "Annual electrical overhaul for a 96-flat high-rise society in Vaishali Nagar.",
      },
      {
        id: "work-5",
        title: "Transformer oil filtration & inspection",
        image: HOME_PHOTOS.electricianHero.src,
        type: "image",
        caption: "High voltage transformer check and surge protector installation.",
      },
      {
        id: "work-6",
        title: "Ground chemical earthing rod",
        image: HOME_PHOTOS.electricianBox.src,
        type: "image",
        caption: "Heavy duty copper chemical earthing pit testing with resistance below 1 ohm.",
      },
    ],
  },
  {
    service_id: "sample-elec-3",
    provider_id: "prov-volt-care",
    category_id: "cat-electrician",
    sub_category_id: "sub-lighting",
    service_name: "Rapid Fan, Chandelier & Light Fitting",
    business_name: "Volt Care Services",
    provider_name: "Sanjay Verma",
    service_desc: "Fast doorstep electricians for ceiling fans, decorative wall sconces, heavy crystal chandeliers, and modular switch replacements.",
    image_urls: [HOME_PHOTOS.electricianPanel.src, HOME_PHOTOS.electricianHero.src],
    is_price_required: true,
    price: 249,
    currency: "INR",
    service_at_location: BookingLocationType.AT_CUSTOMER,
    visiting_charge: 99,
    service_provider_address_id: "addr-3",
    service_radius: 12,
    has_service_duration: true,
    service_duration: 45,
    have_slots: true,
    avg_service_rating: 4.6,
    review_count: 58,
    status: ServiceStatus.ACTIVE,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    is_deleted: false,
    provider_phone_number: "+91 97820 98765",
    provider_whatsapp_country_code: "+91",
    provider_whatsapp_number: "9782098765",
    category_name: ["Electrician", "Lighting Setup"],
    sub_category_name: ["Fan & light fitting", "House wiring"],
    sub_services: ["Fan & light fitting", "House wiring"],
    service_provider_address: "Sector 3, Malviya Nagar, Jaipur",
    service_address: {
      building_no: "3/118",
      floor: "Ground",
      address: "Sector 3, Malviya Nagar",
      landmark: "Near Calgiri Hospital",
      pincode: "302017",
      city_town: "Jaipur",
      state: "Rajasthan",
      latitude: 26.8529,
      longitude: 75.8176,
      country: "India",
    },
    provider_image_url: HOME_PHOTOS.electricianPanel.src,
    pricing_type: PricingType.SINGLE,
    slug: "volt-care-services-malviya-nagar",
    is_verified: true,
    starting_price_label: "Starting from",
    area_name: "Malviya Nagar",
    recent_works: [
      {
        id: "work-7",
        title: "Meter box upgrade in 60 seconds",
        image: HOME_PHOTOS.electricianHero.src,
        type: "reel",
        caption: "Quick reel showing clean cable management and digital meter connector mounting.",
      },
      {
        id: "work-8",
        title: "Custom LED cove lighting",
        image: HOME_PHOTOS.electricianPanel.src,
        type: "image",
        caption: "Installed seamless 24V warm strip lights in residential false ceiling.",
      },
    ],
  },
  {
    service_id: "sample-elec-4",
    provider_id: "prov-jaipur-power-fix",
    category_id: "cat-electrician",
    sub_category_id: "sub-stabilizer",
    service_name: "AC Power Point & Heavy Appliance Wiring",
    business_name: "Jaipur Power Fix",
    provider_name: "Deepak Saini",
    service_desc: "Dedicated power lines for 1.5 & 2.0 ton split ACs, heavy geyser MCBs, stabilizer fixing, and surge prevention.",
    image_urls: [HOME_PHOTOS.acRepair.src, HOME_PHOTOS.electricianHero.src],
    is_price_required: true,
    price: 149,
    currency: "INR",
    service_at_location: BookingLocationType.AT_CUSTOMER,
    visiting_charge: 149,
    service_provider_address_id: "addr-4",
    service_radius: 18,
    has_service_duration: true,
    service_duration: 30,
    have_slots: true,
    avg_service_rating: 4.4,
    review_count: 23,
    status: ServiceStatus.ACTIVE,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    is_deleted: false,
    provider_phone_number: "+91 99280 67890",
    provider_whatsapp_country_code: "+91",
    provider_whatsapp_number: "9928067890",
    category_name: ["Electrician", "Appliance Power"],
    sub_category_name: ["Inverter & stabiliser", "AC power points"],
    sub_services: ["Inverter & stabiliser", "AC power points"],
    service_provider_address: "Mahal Road, Jagatpura, Jaipur",
    service_address: {
      building_no: "B-22",
      floor: "Ground",
      address: "Mahal Road, Jagatpura",
      landmark: "Near Akshay Patra Temple",
      pincode: "302017",
      city_town: "Jaipur",
      state: "Rajasthan",
      latitude: 26.8206,
      longitude: 75.8364,
      country: "India",
    },
    provider_image_url: HOME_PHOTOS.acRepair.src,
    pricing_type: PricingType.SINGLE,
    slug: "jaipur-power-fix-jagatpura",
    is_verified: true,
    starting_price_label: "Starting from",
    area_name: "Jagatpura",
    recent_works: [
      {
        id: "work-9",
        title: "Wiring for 6 new AC units",
        image: HOME_PHOTOS.acRepair.src,
        type: "image",
        caption: "Installed copper power lines with individual 25A MCBs for a multi-story home.",
      },
      {
        id: "work-10",
        title: "Voltage stabilizer wall mount",
        image: HOME_PHOTOS.electricianPanel.src,
        type: "image",
        caption: "Rigid metal brackets and safety grounding for high-capacity inverter stabilizer.",
      },
    ],
  },
  {
    service_id: "sample-elec-5",
    provider_id: "prov-apex-wire",
    category_id: "cat-electrician",
    sub_category_id: "sub-wiring",
    service_name: "Express Short-Circuit & Emergency Repair",
    business_name: "Apex Wire & Repair",
    provider_name: "Mohan Lal",
    service_desc: "24x7 emergency short circuit resolution, power outage diagnosis, burnt wire replacement, and generator changeover switch fixing.",
    image_urls: [HOME_PHOTOS.electricianBox.src, HOME_PHOTOS.electricianHero.src],
    is_price_required: false,
    price: null,
    currency: "INR",
    service_at_location: BookingLocationType.AT_CUSTOMER,
    visiting_charge: 199,
    service_provider_address_id: "addr-5",
    service_radius: 15,
    has_service_duration: true,
    service_duration: 45,
    have_slots: true,
    avg_service_rating: 4.8,
    review_count: 67,
    status: ServiceStatus.ACTIVE,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    is_deleted: false,
    provider_phone_number: "+91 97855 33441",
    provider_whatsapp_country_code: "+91",
    provider_whatsapp_number: "9785533441",
    category_name: ["Electrician", "Emergency"],
    sub_category_name: ["Short-circuit fix", "Emergency 24x7", "Fuse repair"],
    sub_services: ["Short-circuit fix", "Emergency 24x7", "Fuse repair"],
    service_provider_address: "Kanta Chauraha, Jhotwara, Jaipur",
    service_address: {
      building_no: "77",
      floor: "Ground",
      address: "Kanta Chauraha, Jhotwara",
      landmark: "Near Overbridge",
      pincode: "302012",
      city_town: "Jaipur",
      state: "Rajasthan",
      latitude: 26.9451,
      longitude: 75.7533,
      country: "India",
    },
    provider_image_url: HOME_PHOTOS.electricianBox.src,
    pricing_type: PricingType.NOPRICE,
    slug: "apex-wire-repair-jhotwara",
    is_verified: true,
    starting_price_label: "Contact for price",
    area_name: "Jhotwara",
    recent_works: [
      {
        id: "work-12",
        title: "Main line short circuit bypass",
        image: HOME_PHOTOS.electricianHero.src,
        type: "image",
        caption: "Responded within 30 minutes, cleared burnt neutral cable, and restored power safely.",
      },
    ],
  },
  {
    service_id: "sample-elec-6",
    provider_id: "prov-heritage-electricals",
    category_id: "cat-electrician",
    sub_category_id: "sub-heritage",
    service_name: "Architectural & Heritage Lighting Care",
    business_name: "Heritage Electricals",
    provider_name: "Pooja & Team",
    service_desc: "Preserving vintage and heritage home wiring, warm ambient cafe lighting, courtyard floodlights, and smart automation.",
    image_urls: [HOME_PHOTOS.electricianHero.src, HOME_PHOTOS.electricianPanel.src],
    is_price_required: true,
    price: 349,
    currency: "INR",
    service_at_location: BookingLocationType.AT_CUSTOMER,
    visiting_charge: 199,
    service_provider_address_id: "addr-6",
    service_radius: 20,
    has_service_duration: true,
    service_duration: 60,
    have_slots: true,
    avg_service_rating: 4.9,
    review_count: 84,
    status: ServiceStatus.ACTIVE,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    is_deleted: false,
    provider_phone_number: "+91 98290 88776",
    provider_whatsapp_country_code: "+91",
    provider_whatsapp_number: "9829088776",
    category_name: ["Electrician", "Smart Lighting"],
    sub_category_name: ["Smart automation", "Lighting design", "Heritage wiring"],
    sub_services: ["Smart automation", "Lighting design", "Heritage wiring"],
    service_provider_address: "Subhash Marg, C-Scheme, Jaipur",
    service_address: {
      building_no: "12A",
      floor: "2nd",
      address: "Subhash Marg, C-Scheme",
      landmark: "Near Statue Circle",
      pincode: "302001",
      city_town: "Jaipur",
      state: "Rajasthan",
      latitude: 26.9112,
      longitude: 75.8016,
      country: "India",
    },
    provider_image_url: HOME_PHOTOS.electricianHero.src,
    pricing_type: PricingType.SINGLE,
    slug: "heritage-electricals-c-scheme",
    is_verified: true,
    starting_price_label: "Starting from",
    area_name: "C-Scheme",
    recent_works: [
      {
        id: "work-11",
        title: "Boutique restaurant warm glow",
        image: HOME_PHOTOS.electricianPanel.src,
        type: "image",
        caption: "Installed 3-phase automated mood lighting with dimmable pendant fittings.",
      },
    ],
  },
];

export const SAMPLE_EXPLORE_POSTS = [
  {
    id: "exp-1",
    title: "Full panel rewiring, 3BHK",
    author: "Sharma Electric Works",
    badge: "Business post",
    image: HOME_PHOTOS.electricianPanel.src,
    isReel: false,
    link: "/cus/reels",
  },
  {
    id: "exp-2",
    title: "Meter box upgrade in 60 seconds",
    author: "Volt Care Services",
    badge: "Reel",
    image: HOME_PHOTOS.electricianHero.src,
    isReel: true,
    link: "/cus/reels",
  },
  {
    id: "exp-3",
    title: "Society DB maintenance",
    author: "BrightLine Electricals",
    badge: "Business post",
    image: HOME_PHOTOS.electricianBox.src,
    isReel: false,
    link: "/cus/reels",
  },
  {
    id: "exp-4",
    title: "Wiring for 6 new AC units",
    author: "Customer post · tagged Jaipur Power Fix",
    badge: "Customer post",
    image: HOME_PHOTOS.acRepair.src,
    isReel: false,
    link: "/cus/reels",
  },
];

export const SAMPLE_SUB_SERVICE_CHIPS = [
  { id: "all", label: "All electricians" },
  { id: "wiring", label: "Wiring & fittings" },
  { id: "fan-light", label: "Fan & light installation" },
  { id: "inverter", label: "Inverter repair" },
  { id: "mcb", label: "MCB & switchboard" },
  { id: "earthing", label: "Earthing" },
];

export const SAMPLE_AREAS = [
  { name: "Mansarovar", count: 1 },
  { name: "Malviya Nagar", count: 1 },
  { name: "Vaishali Nagar", count: 1 },
  { name: "C-Scheme", count: 1 },
  { name: "Jagatpura", count: 1 },
  { name: "Jhotwara", count: 1 },
];

export const RELATED_CATEGORIES_FOR_EMPTY = [
  { name: "Home deep cleaning", path: "/cus/servicesList?search=cleaning" },
  { name: "Plumbers", path: "/cus/servicesList?search=plumber" },
  { name: "Bathroom cleaning", path: "/cus/servicesList?search=bathroom" },
  { name: "AC Repair", path: "/cus/servicesList?search=ac" },
];
