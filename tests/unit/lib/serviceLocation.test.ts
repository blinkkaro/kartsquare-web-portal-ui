import {
  defaultBookingPlace,
  isBookingPlace,
  offersAtCustomer,
  offersAtProvider,
} from "@/lib/serviceLocation";

describe("serviceLocation", () => {
  it.each(["at_customer", "AT_CUSTOMER", "BOTH", "both"])(
    "%s can be done at the customer's",
    (v) => {
      expect(offersAtCustomer(v)).toBe(true);
    },
  );

  it.each(["at_provider", "AT_PROVIDER", "BOTH"])("%s can be done at the provider's", (v) => {
    expect(offersAtProvider(v)).toBe(true);
  });

  it("keeps the two places apart", () => {
    expect(offersAtCustomer("at_provider")).toBe(false);
    expect(offersAtProvider("AT_CUSTOMER")).toBe(false);
  });

  it("offers neither for a virtual call or a missing value", () => {
    for (const v of ["virtual_call", "", null, undefined]) {
      expect(offersAtCustomer(v)).toBe(false);
      expect(offersAtProvider(v)).toBe(false);
    }
  });

  it("starts the form on the only place offered, in either case", () => {
    expect(defaultBookingPlace("AT_CUSTOMER")).toBe("at_customer");
    expect(defaultBookingPlace("at_provider")).toBe("at_provider");
  });

  it("leaves the form's own default when both (or neither) are offered", () => {
    expect(defaultBookingPlace("BOTH")).toBeUndefined();
    expect(defaultBookingPlace(undefined)).toBeUndefined();
  });

  it("accepts only real places from a radio button", () => {
    expect(isBookingPlace("at_customer")).toBe(true);
    expect(isBookingPlace("at_provider")).toBe(true);
    expect(isBookingPlace("BOTH")).toBe(false);
  });
});

describe("online-only services", () => {
  it("start on a virtual request, with no address", () => {
    const { defaultBookingPlace, isBookingPlace } = jest.requireActual("@/lib/serviceLocation");
    expect(defaultBookingPlace("virtual_call")).toBe("virtual");
    expect(defaultBookingPlace("VIRTUAL")).toBe("virtual");
    expect(isBookingPlace("virtual")).toBe(true);
  });
});
