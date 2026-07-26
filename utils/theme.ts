import { createTheme, responsiveFontSizes, ThemeOptions } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";

const getDesignTokens = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: COLORS.PRIMARY_PURPLE,
      dark: COLORS.PURPLE_HOVER,
    },
    secondary: {
      main: COLORS.SECONDARY_CYAN,
    },
    error: {
      main: COLORS.ERROR_RED,
    },
    warning: {
      main: COLORS.WARNING_AMBER,
    },
    info: {
      main: COLORS.INFO_BLUE,
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
  shape: {
    borderRadius: 3,
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
    // Scale derived from the fontSize/fontWeight values already dominant across
    // the app (see constants/colors.ts sibling audit) rather than invented from
    // scratch, so adopting variants instead of ad-hoc `sx` sizing is low-disruption.
    h1: { fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.2 },
    h2: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.25 },
    h3: { fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3 },
    h4: { fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.35 },
    h5: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },
    subtitle1: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.5 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6 },
    caption: { fontSize: "0.75rem", fontWeight: 500, lineHeight: 1.4 },
    overline: {
      fontSize: "0.7rem",
      fontWeight: 600,
      lineHeight: 1.4,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
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
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0,0,0,0.5)"
              : `0 4px 12px ${COLORS.SHADOW.DEFAULT}`,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
  },
});

export const createCustomTheme = (mode: "light" | "dark") =>
  responsiveFontSizes(createTheme(getDesignTokens(mode)));
