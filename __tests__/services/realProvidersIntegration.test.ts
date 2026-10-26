import { mapRealServiceToEnriched } from "@/components/pages/servicesList/servicesSampleData";
import { Service, ServiceStatus, BookingLocationType, PricingType } from "@/services/serviceList/listInteraface";

describe("Real Providers Data Integration", () => {
  it("maps real provider data accurately without relying on sample data", () => {
    const realService: Service = {
      service_id: "srv-aditya-101",
      provider_id: "prov-aditya-999",
      category_id: "cat-home-srv",
      sub_category_id: "sub-ac",
      service_name: "Aditya Air Com",
      business_name: "Aditiya Air Con",
      provider_name: "Aditya Bhagat",
      service_desc: "Professional AC repair, installation, and seasonal servicing across Jaipur.",
      image_urls: [
        "https://kartsquare-document.s3.ap-south-1.amazonaws.com/documents/aditya-1.png",
        "https://kartsquare-document.s3.ap-south-1.amazonaws.com/documents/aditya-2.png",
      ],
      is_price_required: true,
      price: 0,
      currency: "INR",
      service_at_location: BookingLocationType.AT_CUSTOMER,
      visiting_charge: 250,
      service_provider_address_id: "addr-satya-nagar",
      service_radius: 25,
      has_service_duration: false,
      service_duration: null,
      have_slots: false,
      avg_service_rating: 4.8,
      review_count: 32,
      status: ServiceStatus.ACTIVE,
      created_at: "2026-10-01T10:00:00.000Z",
      updated_at: "2026-10-26T10:00:00.000Z",
      deleted_at: null,
      is_deleted: false,
      provider_phone_number: "9829011111",
      provider_whatsapp_country_code: "+91",
      provider_whatsapp_number: "9829011111",
      provider_image_url: "https://kartsquare-document.s3.ap-south-1.amazonaws.com/documents/aditya-avatar.jpg",
      pricing_type: PricingType.MULTIPLE,
      category_name: ["Home Services"],
      sub_category_name: ["AC Repair & Service", "Electrician"],
      service_provider_address: "Tauji Circle, Satya Nagar",
      service_address: {
        building_no: "12",
        floor: "Ground",
        address: "Tauji Circle",
        landmark: "Satya Nagar",
        pincode: "302012",
        city_town: "Jaipur",
        state: "Rajasthan",
        country: "India",
        latitude: 26.9428,
        longitude: 75.7147,
      },
      price_items: [
        { service_name: "AC Jet Service", service_desc: "Deep foam wash & jet cleaning", price: 499 },
        { service_name: "AC Installation", service_desc: "Standard split AC mount", price: 1200 },
      ],
    };

    const enriched = mapRealServiceToEnriched(realService);

    // Business identity
    expect(enriched.business_name).toBe("Aditiya Air Con");
    expect(enriched.provider_name).toBe("Aditya Bhagat");
    expect(enriched.is_verified).toBe(true);

    // Computed starting price
    expect(enriched.price).toBe(499);
    expect(enriched.starting_price_label).toBe("Starting from");
    expect(enriched.is_price_required).toBe(true);

    // Address & area
    expect(enriched.area_name).toBe("Satya Nagar");
    expect(enriched.service_address?.city_town).toBe("Jaipur");

    // Sub-services derived from real category and price items
    expect(enriched.sub_services).toContain("AC Repair & Service");
    expect(enriched.sub_services).toContain("Electrician");
    expect(enriched.sub_services).toContain("AC Jet Service");
    expect(enriched.sub_services).toContain("AC Installation");

    // Recent works built from real S3 images and price items
    expect(enriched.recent_works).toHaveLength(2);
    expect(enriched.recent_works?.[0].image).toBe(
      "https://kartsquare-document.s3.ap-south-1.amazonaws.com/documents/aditya-1.png"
    );
    expect(enriched.recent_works?.[0].title).toBe("AC Jet Service");
    expect(enriched.recent_works?.[0].caption).toBe("Deep foam wash & jet cleaning");
  });

  it("handles services without price items using visiting charge", () => {
    const serviceWithVisitingFee: Service = {
      service_id: "srv-ck-solar",
      provider_id: "prov-ck",
      category_id: "cat-energy",
      sub_category_id: "sub-solar",
      service_name: "CK Solar",
      business_name: "CK Solar",
      provider_name: "Chetan Kumawat",
      service_desc: "Solar Panel Installation in Jaipur",
      image_urls: ["https://kartsquare-document.s3.ap-south-1.amazonaws.com/solar.jpg"],
      is_price_required: false,
      price: 0,
      currency: "INR",
      service_at_location: BookingLocationType.AT_CUSTOMER,
      visiting_charge: 200,
      service_provider_address_id: "addr-solar",
      service_radius: 50,
      has_service_duration: false,
      service_duration: null,
      have_slots: false,
      avg_service_rating: 4.5,
      review_count: 5,
      status: ServiceStatus.ACTIVE,
      created_at: "2026-10-01T10:00:00.000Z",
      updated_at: "2026-10-26T10:00:00.000Z",
      deleted_at: null,
      is_deleted: false,
      provider_phone_number: "9829022222",
      provider_whatsapp_country_code: "+91",
      provider_whatsapp_number: "9829022222",
      provider_image_url: "",
      pricing_type: PricingType.NOPRICE,
      category_name: ["Energy & Environment"],
      sub_category_name: ["Solar Panel Installation"],
      service_provider_address: "Tara Nagar, Jhotwara",
      service_address: {
        building_no: "B-Scheme",
        floor: "",
        address: "Tara Nagar",
        landmark: "Jaidurga College",
        pincode: "302012",
        city_town: "Jaipur",
        state: "Rajasthan",
        country: "India",
        latitude: 26.94,
        longitude: 75.72,
      },
    };

    const enriched = mapRealServiceToEnriched(serviceWithVisitingFee);

    expect(enriched.price).toBe(200);
    expect(enriched.starting_price_label).toBe("Visiting fee");
    expect(enriched.area_name).toBe("Jaidurga College");
    expect(enriched.sub_services).toContain("Solar Panel Installation");
  });
});
