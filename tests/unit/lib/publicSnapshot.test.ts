import { toPublicSnapshot } from "@/lib/seo/publicSnapshot";

describe("toPublicSnapshot", () => {
  it("removes personal and internal fields at any depth", () => {
    const out = toPublicSnapshot({
      business_name: "Shop",
      provider_phone_number: "x",
      provider_whatsapp_number: "x",
      profile: { first_name: "A", email: "x", phone_number: "x", birth_date: "x", gender: "x" },
      services: [{ service_name: "Repair", provider_phone_number: "x", rejected_reason: "x" }],
    });

    expect(out).toEqual({
      business_name: "Shop",
      profile: { first_name: "A" },
      services: [{ service_name: "Repair" }],
    });
  });

  it("keeps only the area of a profile's default address", () => {
    const out = toPublicSnapshot({
      default_address: { building_no: "x", address: "x", pincode: "x", latitude: 1, city_town: "Jaipur", state: "RJ" },
    });

    expect(out).toEqual({ default_address: { city_town: "Jaipur", state: "RJ" } });
  });

  it("drops the one-line provider address that comes with a profile's services", () => {
    const out = toPublicSnapshot({ services: [{ business_name: "Shop", service_provider_address: "x" }] });

    expect(out).toEqual({ services: [{ business_name: "Shop" }] });
  });

  it("keeps a listing's business address, which the page shows", () => {
    const service_address = { address: "Shop 4", city_town: "Jaipur" };
    expect(toPublicSnapshot({ service_address })).toEqual({ service_address });
  });

  it("does not change the record it was given", () => {
    const record = { email: "x" };
    toPublicSnapshot(record);
    expect(record).toEqual({ email: "x" });
  });
});
