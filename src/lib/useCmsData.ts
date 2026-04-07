'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from './TranslationContext';

/**
 * Fetches CMS data for a section, automatically appending the current locale
 * so the API returns the translated version for fa/ps users.
 */
export function useCmsData<T = Record<string, any>>(section: string): T | null {
  const { locale } = useTranslation();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/data/${section}?locale=${locale}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d && typeof d === 'object' && Object.keys(d).length > 0) {
          setData(d as T);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [section, locale]);

  return data;
}
