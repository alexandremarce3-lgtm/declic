import { getLocales } from 'expo-localization';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { contentPacks, createCatalog, type Catalog } from '@/content';
import type { UiStrings } from './fr';
import { DEFAULT_LOCALE, uiStrings, type Locale } from './locales';

/**
 * Langue de l'app = première langue du téléphone pour laquelle
 * l'interface ET le contenu sont traduits. Sinon : français.
 * (Une langue à moitié traduite n'est jamais activée.)
 */
export function resolveLocale(deviceLanguages: (string | null)[]): Locale {
  for (const code of deviceLanguages) {
    if (code && code in uiStrings && contentPacks[code as Locale]) return code as Locale;
  }
  return DEFAULT_LOCALE;
}

/** Langues réellement disponibles (interface + contenu) */
export const availableLocales = (Object.keys(uiStrings) as Locale[]).filter((l) => contentPacks[l]);

type I18n = { locale: Locale; t: UiStrings; catalog: Catalog };

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children, locale: forced }: { children: ReactNode; locale?: Locale }) {
  const value = useMemo<I18n>(() => {
    const locale = forced ?? resolveLocale(getLocales().map((l) => l.languageCode));
    return { locale, t: uiStrings[locale], catalog: createCatalog(contentPacks[locale] ?? contentPacks.fr!) };
  }, [forced]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n doit être utilisé dans <I18nProvider>');
  return ctx;
}
