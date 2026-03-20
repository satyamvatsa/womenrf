'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';

const DEFAULT_HERO_BG = '/images/GettyImages-1232002648.jpg';

function getLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && ['en', 'fa', 'ps'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '/en';
}

export default function Hero() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const currentLocale = localePrefix.replace('/', '');
  const { t } = useTranslation();

  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    fetch('/api/data/homepage', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d && Object.keys(d).length > 0) setAdminData(d);
        setDataLoaded(true);
      })
      .catch(() => setDataLoaded(true));
  }, []);

  const heroImageUrl = dataLoaded ? (adminData?.heroImageUrl || DEFAULT_HERO_BG) : '';

  const HERO_BG_MAP: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  const heroTitleBgClass = HERO_BG_MAP[adminData?.heroTitleBg] || adminData?.heroTitleBg || 'bg-wrf-purple';
  const heroBtn1BgClass = HERO_BG_MAP[adminData?.heroButton1Color] || 'bg-wrf-coral';
  const heroBtn2BgClass = HERO_BG_MAP[adminData?.heroButton2Color] || 'bg-wrf-black';

  if (adminData?.showHero === false) return null;

  return (
    <>
      {heroImageUrl && <link rel="preload" as="image" href={heroImageUrl} />}
    <section
      className="relative overflow-hidden py-20 md:py-32 transition-[background-image] duration-700 ease-in"
      style={{
        backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#3d3060',
      }}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className={`mb-6 inline-block ${heroTitleBgClass} px-8 py-6`}>
              <h1 className="mb-4 text-4xl font-bold leading-tight text-white lg:text-6xl">
                {(currentLocale === 'en' && adminData?.heroTitle) || t('hero.title')}
              </h1>
              <p className="text-xl leading-relaxed text-white/90">
                {(currentLocale === 'en' && adminData?.heroSubtitle) || t('hero.description')}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={adminData?.heroButton1Link || `${localePrefix}/About`}
                className={`flex items-center justify-center gap-2 rounded-none ${heroBtn1BgClass} px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:opacity-90`}
              >
                {(currentLocale === 'en' && adminData?.heroButton1Text) || t('hero.learnStory')}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={adminData?.heroButton2Link || `${localePrefix}/Programs`}
                className={`flex items-center justify-center gap-2 rounded-none ${heroBtn2BgClass} px-8 py-4 font-semibold text-white transition-all duration-300 hover:opacity-90`}
              >
                {(currentLocale === 'en' && adminData?.heroButton2Text) || t('hero.ourPrograms')}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
