import { useTranslationContext } from '@/features/i18n/TranslationContext';

export const useTranslate = () => {
  const { t, locale, setLocale } = useTranslationContext();
  return { t, locale, changeLanguage: setLocale };
};
