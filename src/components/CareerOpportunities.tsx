'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

function getLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && ['en', 'fa', 'ps'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '/en';
}

export default function CareerOpportunities() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const { t } = useTranslation();

  const adminData = useCmsData<Record<string, any>>('homepage');
  const vacancyData = useCmsData<Record<string, any> | any[]>('vacancies');

  const showVacancies = adminData?.showVacancies !== undefined ? adminData.showVacancies : true;
  const title = adminData?.vacanciesTitle || t('careers.title');
  const subtitle = adminData?.vacanciesSubtitle || t('careers.subtitle');
  const titleBg = adminData?.vacanciesTitleBg || 'bg-accent';
  const buttonColor = adminData?.vacanciesButtonColor || 'bg-primary';

  const BG_MAP: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  const titleBgClass = BG_MAP[titleBg] || 'bg-wrf-coral';
  const btnBgClass = BG_MAP[buttonColor] || 'bg-wrf-black';

  if (!showVacancies) return null;

  const vacanciesList = Array.isArray(vacancyData)
    ? vacancyData
    : (vacancyData && Array.isArray((vacancyData as Record<string, any>).vacancies)
      ? (vacancyData as Record<string, any>).vacancies
      : []);
  const openVacancies = vacanciesList.filter((v: any) => v.status === 'open');

  return (
    <section id="careers" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <div className={`mb-4 inline-block ${titleBgClass} px-8 py-6`}>
            <h2 className="text-4xl font-bold text-white">{title}</h2>
          </div>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        {openVacancies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {openVacancies.slice(0, 3).map((v: any) => (
              <div key={v.id} className="flex flex-col bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {v.type && (
                    <span className="bg-wrf-purple px-3 py-1 text-xs font-semibold text-white">{v.type}</span>
                  )}
                  {v.category && (
                    <span className="bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">{v.category}</span>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-bold text-wrf-black">{v.title}</h3>
                {v.description && (
                  <div className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
                    {v.description.split('\n').map((para: string, i: number) => (
                      para.trim() ? (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>{para}</p>
                      ) : null
                    ))}
                  </div>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
                  {v.location && (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      {v.location}
                    </span>
                  )}
                  {v.deadline && (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                      {new Date(v.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded bg-white p-8 text-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 text-gray-300">
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" />
            </svg>
            <p className="text-gray-500">{t('careers.noOpenings')}</p>
          </div>
        )}

        <div className="mt-10 text-left">
          <Link
            href={`${localePrefix}/Vacancies`}
            className={`inline-flex items-center gap-2 ${btnBgClass} px-8 py-3 font-semibold text-white transition-colors hover:opacity-90`}
          >
            {t('careers.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
