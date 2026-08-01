"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createCustomTheme } from "@/utils/theme";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { TranslationProvider } from "@/features/i18n/TranslationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegistrationGuard from "@/helper/RegistrationGuard";
import { SocketProvider } from "@/contexts/SocketContext";

import { useHydrateStore } from "@/hooks/useHydrateStore";
import { Toaster } from "react-hot-toast";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector((state) => state.ui.mode);

  // Hydrate store from localStorage on mount
  useHydrateStore();

  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  // Sync mode with document body attribute for global CSS.
  // Runs in an effect (post-hydration) rather than during render, since
  // mutating the server-rendered <body> during render triggers a hydration mismatch.
  useEffect(() => {
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

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
            refetchOnMount: false, // Don't refetch on mount if data exists
            refetchOnReconnect: true, // Refetch on reconnect
            retry: 1, // Retry failed requests once
            staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
            gcTime: 5 * 60 * 1000, // Cache data for 5 minutes (formerly cacheTime)
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouterCacheProvider>
          <TranslationProvider>
            <SocketProvider>
              <ThemeWrapper>
                <Toaster position="top-right" />
                <RegistrationGuard>{children}</RegistrationGuard>
              </ThemeWrapper>
            </SocketProvider>
          </TranslationProvider>
        </AppRouterCacheProvider>
      </QueryClientProvider>
    </Provider>
  );
}
