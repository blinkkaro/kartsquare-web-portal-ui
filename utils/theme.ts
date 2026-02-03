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
