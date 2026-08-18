export const LIVE_LOCATION_API_ENDPOINTS = {
  STATUS: "/live-location/me",
  PING: "/live-location/me/ping",
  PIN: "/live-location/me/pin",
  MODE: "/live-location/me/mode",
  OFFLINE: "/live-location/me/offline",
  FOR_BOOKING: (bookingId: string) => `/live-location/bookings/${bookingId}`,
} as const;
