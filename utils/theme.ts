import { createTheme, ThemeOptions } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";

const getDesignTokens = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: COLORS.PRIMARY_PURPLE,
      dark: COLORS.PURPLE_HOVER,
    },
    secondary: {
      main: "#00B2FF", // --color-secondary
    },
    background: {
      default:
        mode === "light"
          ? COLORS.BACKGROUND.PRIMARY_LIGHT
          : COLORS.BACKGROUND.PRIMARY_DARK,
      paper:
        mode === "light"
          ? COLORS.BACKGROUND.PAPER_LIGHT
          : COLORS.BACKGROUND.PAPER_DARK,
    },
    text: {
      primary:
        mode === "light" ? COLORS.TEXT.PRIMARY_LIGHT : COLORS.TEXT.PRIMARY_DARK,
      secondary:
        mode === "light"
          ? COLORS.TEXT.SECONDARY_LIGHT
          : COLORS.TEXT.SECONDARY_DARK,
    },
    divider:
      mode === "light"
        ? COLORS.BORDER.DEFAULT_LIGHT
        : COLORS.BORDER.DEFAULT_DARK,
    success: {
      main: COLORS.SUCCESS_GREEN,
    },
  },
  typography: {
    fontFamily: [
      '"Poppins"',
      '"Roboto"',
      '"Nunito"',
      '"Lato"',
      '"Mulish"',
      '"Rubik"',
      '"Ubuntu"',
      '"Fira Sans"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    // Fluid scale via clamp() — one definition per level, no per-page overrides needed.
    // Tiers: h1 hero > h2 page title > h3 section title > h4 subsection/card group title
    // > h5 card title > h6 small label heading > subtitle > body > caption.
    h1: {
      fontSize: "clamp(2.25rem, 1.6rem + 2.6vw, 4rem)",
      fontWeight: 700,
      lineHeight: 1.15,
    },
    h2: {
      fontSize: "clamp(1.875rem, 1.45rem + 1.8vw, 3rem)",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "clamp(1.625rem, 1.35rem + 1.2vw, 2.375rem)",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h4: {
      fontSize: "clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: "clamp(1.125rem, 1.03rem + 0.4vw, 1.375rem)",
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h6: {
      fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.45,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.55,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export const createCustomTheme = (mode: "light" | "dark") =>
  createTheme(getDesignTokens(mode));
