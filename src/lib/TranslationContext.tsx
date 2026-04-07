'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import enFallback from './translations/en';

export type Locale = 'en' | 'fa' | 'ps';
type TranslationMap = Record<string, string>;

interface TranslationContextValue {
  locale: Locale;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  localePrefix: string;
}

const TranslationContext = createContext<TranslationContextValue>({
  locale: 'en',
  t: (key: string) => key,
  dir: 'ltr',
  localePrefix: '/en',
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const locale: Locale = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments[0] === 'fa' || segments[0] === 'ps' ? segments[0] : 'en';
  }, [pathname]);

  const [dbStrings, setDbStrings] = useState<TranslationMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/translations?locale=${locale}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data && typeof data === 'object' && Object.keys(data).length > 0) {
          setDbStrings(data);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [locale]);

  const value = useMemo(() => {
    const dir: 'ltr' | 'rtl' = locale === 'fa' || locale === 'ps' ? 'rtl' : 'ltr';

    const t = (key: string): string => {
      if (dbStrings?.[key]) return dbStrings[key];
      return enFallback[key] ?? key;
    };

    return { locale, t, dir, localePrefix: `/${locale}` };
  }, [locale, dbStrings]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
