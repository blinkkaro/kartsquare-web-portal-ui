import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Every dashboard button is the platform's shared Button plus this: a 44px touch height and the
 * same horizontal padding, so Add service, Copy link, Next step and the rest are one size.
 */
export const DASHBOARD_BUTTON_SX: SxProps<Theme> = { minHeight: 44, px: 2.5, whiteSpace: "nowrap" };
