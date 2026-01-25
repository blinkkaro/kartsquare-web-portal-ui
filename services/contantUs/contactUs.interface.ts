export interface ContactUsInterface {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  message: string;
}

export enum waitlist_type {
  CONTACT_US = "CONTACT_US",
  JOIN_WAITLIST = "JOIN_WAITLIST",
}
