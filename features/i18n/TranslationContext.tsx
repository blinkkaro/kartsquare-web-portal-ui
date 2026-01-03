'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define available languages
export type Locale = 'en' | 'es' | 'hi';

// Define translation keys (example)
export type TranslationKey =
    | 'welcome_back'
    | 'email_address'
    | 'password'
    | 'forgot_password'
    | 'login'
    | 'continue_with_google'
    | 'no_account'
    | 'sign_up'
    | 'brand_tagline';

// Sample dictionaries
const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
    en: {
        welcome_back: 'Welcome back!',
        email_address: 'Email Address',
        password: 'Password',
        forgot_password: 'Forgot Password?',
        login: 'Login',
        continue_with_google: 'Continue with Google',
        no_account: "You don't have an account?",
        sign_up: 'Sign up',
        brand_tagline: 'Your 8 Handed Partner',
    },
    es: {
        welcome_back: '¡Bienvenido de nuevo!',
        email_address: 'Correo electrónico',
        password: 'Contraseña',
        forgot_password: '¿Olvidaste tu contraseña?',
        login: 'Iniciar sesión',
        continue_with_google: 'Continuar con Google',
        no_account: '¿No tienes una cuenta?',
        sign_up: 'Regístrate',
        brand_tagline: 'Tu socio de 8 manos',
    },
    hi: {
        welcome_back: 'वापसी पर स्वागत है!',
        email_address: 'ईमेल पता',
        password: 'पासवर्ड',
        forgot_password: 'पासवर्ड भूल गए?',
        login: 'लॉग इन करें',
        continue_with_google: 'Google के साथ जारी रखें',
        no_account: 'क्या आपके पास खाता नहीं है?',
        sign_up: 'साइन अप करें',
        brand_tagline: 'आपका 8 हाथों वाला साथी',
    },
};

interface TranslationContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('en');

    const t = (key: TranslationKey): string => {
        return dictionaries[locale][key] || key;
    };

    return (
        <TranslationContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslationContext() {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslationContext must be used within a TranslationProvider');
    }
    return context;
}
