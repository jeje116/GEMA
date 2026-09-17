import { Locale, DEFAULT_LOCALE } from './config';
import { translations } from './translations';

export function l(localized: { en: string; id: string } | undefined, locale: Locale): string {
  if (!localized) return '';
  if (locale === 'id' && localized.id && localized.id.trim().length > 0) {
    return localized.id;
  }
  return localized.en || '';
}

export function getDictionary(locale: Locale) {
  const dict = translations[locale] || translations[DEFAULT_LOCALE];
  const fallbackDict = translations[DEFAULT_LOCALE];

  return {
    t: (key: string, fallback?: string): string => {
      return dict[key] || fallbackDict[key] || fallback || key;
    },
    l: (localized: { en: string; id: string } | undefined): string => {
      return l(localized, locale);
    },
    locale,
  };
}
