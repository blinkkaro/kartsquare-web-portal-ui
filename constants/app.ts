/** Kartsquare Android app: listing confirmed live (HTTP 200) on 14 Nov 2026. */
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.kartsquare";

export interface AppScreen {
  /** File under public/. Real captures of the app only. */
  src: string;
  alt: string;
  caption: string;
}

/**
 * Screenshots shown beside "How Kart AI works". Empty until real captures are added:
 * drop PNGs in public/images/app/ and list them here, in the order they should appear.
 */
export const APP_SCREENS: AppScreen[] = [];
