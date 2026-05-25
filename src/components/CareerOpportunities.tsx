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

const TYPE_COLORS: Record<string, string> = {
  'full-time': 'bg-wrf-purple text-white',
  'part-time': 'bg-wrf-coral text-white',
  'contract': 'bg-amber-500 text-white',
  'internship': 'bg-teal-500 text-white',
};

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

  const truncate = (text: string, maxLen = 150) => {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen).trimEnd() + '…';
  };

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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {openVacancies.slice(0, 3).map((v: any) => (
              <div key={v.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-lg hover:ring-wrf-purple/20">
                {/* Card header */}
                <div className="flex items-start gap-4 p-5 pb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wrf-purple/10 to-wrf-coral/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-wrf-purple">
                      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    {v.category && (
                      <p className="mb-0.5 text-xs font-medium text-wrf-purple">{v.category}</p>
                    )}
                    <h3 className="text-base font-bold leading-snug text-wrf-black group-hover:text-wrf-purple transition-colors">
                      {v.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1 px-5">
                  {v.description && (
                    <p className="text-sm leading-relaxed text-gray-500">{truncate(v.description)}</p>
                  )}
                </div>

                {/* Card footer */}
                <div className="mt-4 border-t border-gray-100 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {v.type && (
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${TYPE_COLORS[v.type] || 'bg-gray-200 text-gray-700'}`}>
                        {v.type}
                      </span>
                    )}
                    {v.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {v.location}
                      </span>
                    )}
                    {v.deadline && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                        {new Date(v.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
            </div>
            <p className="text-gray-500">{t('careers.noOpenings')}</p>
          </div>
        )}

        <div className="mt-10 text-left">
          <Link
            href={`${localePrefix}/Vacancies`}
            className={`inline-flex items-center gap-2 rounded-xl ${btnBgClass} px-8 py-3 font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md`}
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
