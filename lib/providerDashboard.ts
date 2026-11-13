import type { CompletenessKey } from "@/services/providerDashboard/providerDashboard.interface";

export type GreetingPart = "morning" | "afternoon" | "evening";

/** 5-11 morning, 12-16 afternoon, otherwise evening (local hour, 0-23). */
export function greetingPart(hour: number): GreetingPart {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  return "evening";
}

/** Where each profile-checklist step is completed. */
export const COMPLETENESS_ROUTES: Record<CompletenessKey, string> = {
  has_service: "/spr/servicesList",
  has_business_photos: "/myAccount/myBusinessInfo",
  has_working_hours: "/myAccount/mySchedule",
  has_profile_photo: "/myAccount/personal-info",
  has_business_description: "/myAccount/myBusinessInfo",
  has_address: "/myAccount/myBusinessInfo",
};

/** Public provider page path, or null when the provider has no username yet. */
export function publicProfilePath(username: string | null | undefined): string | null {
  const u = username?.trim();
  return u ? `/in/${encodeURIComponent(u)}` : null;
}
