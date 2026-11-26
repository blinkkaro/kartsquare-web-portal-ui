/**
 * What the server may put into a page's HTML.
 *
 * Public pages render on the server from the public API so crawlers see the content. That API also returns
 * personal and internal fields, and anything handed to a client component is written into the HTML, where
 * search engines can index it. Those fields are removed here. The browser then fetches the full record and
 * shows what it showed before.
 */
const PRIVATE_KEYS = new Set([
  "email",
  "contact_email",
  "phone_number",
  "country_code",
  "birth_date",
  "gender",
  "preferences",
  "unread_notification_count",
  "provider_phone_number",
  "provider_whatsapp_country_code",
  "provider_whatsapp_number",
  "rejected_reason",
  "structured_data",
  "otp",
  // A one-line copy of the provider's full address that comes with each service in a profile.
  "service_provider_address",
]);

/** A profile's default address can be a home address: only the area is rendered on the server. */
const AREA_KEYS = new Set(["city_town", "state", "country"]);

function clean(value: unknown, onlyKeys?: Set<string>): unknown {
  if (Array.isArray(value)) return value.map((item) => clean(item));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !PRIVATE_KEYS.has(key) && (!onlyKeys || onlyKeys.has(key)))
      .map(([key, item]) => [key, clean(item, key === "default_address" ? AREA_KEYS : undefined)]),
  );
}

export function toPublicSnapshot<T>(record: T): T {
  return clean(record) as T;
}
