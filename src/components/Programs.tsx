'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';

function getLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && ['en', 'fa', 'ps'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '/en';
}

export default function Programs() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const { t } = useTranslation();

  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  const [homepageData, setHomepageData] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    fetch('/api/data/programs', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
    fetch('/api/data/homepage', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setHomepageData(d); })
      .catch(() => {});
  }, []);

  const PROGRAMS = [
    {
      id: 'peacebuilding-social-cohesion',
      image: '/Peacebuilding and Social Cohesion.jpg',
      title: t('programs.peacebuilding.title'),
      description: t('programs.peacebuilding.description'),
      theme: 'secondary' as const,
    },
    {
      id: 'legal-empowerment-international-accountability',
      image: '/Legal Empowerment & International Accountability.jpg',
      title: t('programs.legal.title'),
      description: t('programs.legal.description'),
      theme: 'primary' as const,
    },
    {
      id: 'digital-transformation-open-gender-data',
      image: '/Digital Transformation and Open Gender Data.avif',
      title: t('programs.digital.title'),
      description: t('programs.digital.description'),
      theme: 'secondary' as const,
    },
    {
      id: 'representation-advocacy',
      image: '/Representation and Advocacy.jpg',
      title: t('programs.advocacy.title'),
      description: t('programs.advocacy.description'),
      theme: 'secondary' as const,
    },
  ];

  const programs: { id: string; image: string; title: string; description: string; theme: 'primary' | 'secondary' }[] = adminData?.programs?.length
    ? adminData.programs
        .filter((p: any) => p.status === 'active' && p.featured)
        .slice(0, 4)
        .map((p: any, i: number) => ({
          id: p.slug || p.id,
          image: p.imageUrl || PROGRAMS[i]?.image || '',
          title: p.title,
          description: p.shortDescription,
          theme: i % 2 === 1 ? ('primary' as const) : ('secondary' as const),
        }))
    : PROGRAMS;

  const PROG_BG_MAP: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  const showPrograms = homepageData?.showPrograms !== undefined ? homepageData.showPrograms : true;
  const progTitle = homepageData?.programsTitle || t('programs.title');
  const progSubtitle = homepageData?.programsSubtitle || t('programs.description');
  const progTitleBg = PROG_BG_MAP[homepageData?.programsTitleBg] || 'bg-wrf-purple';

  if (!showPrograms) return null;

  return (
    <section id="programs" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <div className={`mb-4 inline-block ${progTitleBg} px-8 py-6`}>
            <h2 className="text-4xl font-bold text-white">
              {progTitle}
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            {progSubtitle}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <article
              key={program.id}
              className="group flex flex-col rounded-none bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className="h-48 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodeURI(program.image)}
                  alt={program.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div
                className={`flex flex-1 flex-col p-6 ${
                  program.theme === 'primary' ? 'bg-wrf-black' : 'bg-wrf-purple'
                }`}
              >
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white transition-opacity group-hover:opacity-90">
                    {program.title}
                  </h3>
                  <p className="mb-4 flex-grow text-sm leading-relaxed text-white/80 line-clamp-3">
                    {program.description}
                  </p>
                </div>
                <div className="mt-auto">
                  <Link
                    href={`${localePrefix}/ProgramPage?slug=${program.id}`}
                    className={`inline-flex h-9 items-center justify-center gap-1 rounded-none px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      program.theme === 'primary'
                        ? 'bg-white text-wrf-black hover:bg-gray-100 focus-visible:ring-wrf-black'
                        : 'bg-white text-wrf-purple hover:bg-gray-100 focus-visible:ring-wrf-purple'
                    }`}
                  >
                    {t('programs.learnMore')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
