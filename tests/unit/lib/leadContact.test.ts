import { getLeadContact, isNewLead } from "@/lib/leadContact";

describe("getLeadContact", () => {
  it("builds call and WhatsApp links from the stored parts", () => {
    expect(getLeadContact({ country_code: "+91", phone_number: "98765 43210" })).toEqual({
      phoneLabel: "+91 9876543210",
      telHref: "tel:+919876543210",
      whatsAppHref: "https://wa.me/919876543210",
    });
  });

  it("uses India's code when none was saved", () => {
    expect(getLeadContact({ country_code: "", phone_number: "9876543210" }).telHref).toBe(
      "tel:+919876543210",
    );
  });

  it("gives no links without a phone number", () => {
    expect(getLeadContact({ country_code: "+91", phone_number: "" })).toEqual({ phoneLabel: "" });
  });
});

describe("isNewLead", () => {
  const now = Date.parse("2026-11-28T00:00:00Z");

  it("is true inside seven days and false after", () => {
    expect(isNewLead("2026-11-22T00:00:00Z", now)).toBe(true);
    expect(isNewLead("2026-11-20T00:00:00Z", now)).toBe(false);
  });
});
