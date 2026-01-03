import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#8800FF', // --color-primary
    },
    secondary: {
      main: '#00B2FF', // --color-secondary
    },
    background: {
      default: mode === 'light' ? '#FFFFFF' : '#172023', // --color-dark for dark mode
      paper: mode === 'light' ? '#FFFFFF' : '#1e2930',
    },
    text: {
      primary: mode === 'light' ? '#172023' : '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export const createCustomTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
