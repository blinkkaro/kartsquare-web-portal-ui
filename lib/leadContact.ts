import type { Lead } from "@/services/leads/lead.interface";

const NEW_LEAD_DAYS = 7;
/** India: used for WhatsApp links when a lead was saved without a country code. */
const DEFAULT_DIAL_CODE = "91";

export interface LeadContact {
  phoneLabel: string;
  telHref?: string;
  whatsAppHref?: string;
}

/** Display text and call / WhatsApp links for a lead. No links without a phone number. */
export function getLeadContact(
  lead: Pick<Lead, "country_code" | "phone_number">,
): LeadContact {
  const number = (lead.phone_number ?? "").replace(/\D/g, "");
  if (!number) return { phoneLabel: "" };
  const code = (lead.country_code ?? "").replace(/\D/g, "") || DEFAULT_DIAL_CODE;
  return {
    phoneLabel: `+${code} ${number}`,
    telHref: `tel:+${code}${number}`,
    whatsAppHref: `https://wa.me/${code}${number}`,
  };
}

/** Same 7-day window the dashboard summary uses for its "new leads" count. */
export function isNewLead(createdAt: Date | string, now: number = Date.now()): boolean {
  return now - new Date(createdAt).getTime() < NEW_LEAD_DAYS * 24 * 60 * 60 * 1000;
}
