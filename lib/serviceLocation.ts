/**
 * Where a service can be delivered. The API's `service_at_location` arrives in either case
 * ("at_customer" or "AT_CUSTOMER"), and "BOTH" means either place; these helpers read it once,
 * case-insensitively, so pages do not each compare every spelling.
 */
export type BookingPlace = "at_customer" | "at_provider";

const normalize = (value: string | null | undefined): string => (value ?? "").trim().toLowerCase();

/** The customer can book the provider to come to them. */
export function offersAtCustomer(value: string | null | undefined): boolean {
  const v = normalize(value);
  return v === "at_customer" || v === "both";
}

/** The customer can go to the provider's place. */
export function offersAtProvider(value: string | null | undefined): boolean {
  const v = normalize(value);
  return v === "at_provider" || v === "both";
}

/**
 * The place a booking form should start on: the only one offered, or undefined when the service
 * offers both (or neither), so the form keeps its own default.
 */
export function defaultBookingPlace(value: string | null | undefined): BookingPlace | undefined {
  const v = normalize(value);
  if (v === "at_customer") return "at_customer";
  if (v === "at_provider") return "at_provider";
  return undefined;
}

/** Narrows a radio button's string value to a booking place. */
export function isBookingPlace(value: string): value is BookingPlace {
  return value === "at_customer" || value === "at_provider";
}
