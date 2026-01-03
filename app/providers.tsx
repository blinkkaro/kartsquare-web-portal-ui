'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createCustomTheme } from '@/utils/theme';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { TranslationProvider } from '@/features/i18n/TranslationContext';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const mode = useAppSelector((state) => state.ui.mode);

    const theme = useMemo(() => createCustomTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AppRouterCacheProvider>
                <TranslationProvider>
                    <ThemeWrapper>{children}</ThemeWrapper>
                </TranslationProvider>
            </AppRouterCacheProvider>
        </Provider>
    );
}
