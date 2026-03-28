export const EMAIL_MARKETING_API_ENDPOINTS = {
  SMTP_SETTINGS: "/email-marketing/smtp-settings",
  CAMPAIGNS: "/email-marketing/campaigns",
  START_CAMPAIGN: (id: string | number) => `/email-marketing/campaigns/${id}/send`,
  CAMPAIGN_DETAILS: (id: string | number) => `/email-marketing/campaigns/${id}`,
  UNSUBSCRIBE: "/email-marketing/unsubscribe", // Although this might be GET, we define it here for public APIs
};
