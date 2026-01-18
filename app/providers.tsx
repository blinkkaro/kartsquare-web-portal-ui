"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createCustomTheme } from "@/utils/theme";
import { useAppSelector } from "@/store/hooks";
import { useMemo, useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { TranslationProvider } from "@/features/i18n/TranslationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegistrationGuard from "@/helper/RegistrationGuard";

import { useHydrateStore } from "@/hooks/useHydrateStore";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector((state) => state.ui.mode);

  // Hydrate store from localStorage on mount
  useHydrateStore();

  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouterCacheProvider>
          <TranslationProvider>
            <ThemeWrapper>
              <RegistrationGuard>{children}</RegistrationGuard>
            </ThemeWrapper>
          </TranslationProvider>
        </AppRouterCacheProvider>
      </QueryClientProvider>
    </Provider>
  );
}
