'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

interface ReportPdf {
  language: 'english' | 'dari' | 'pashto';
  url: string;
  fileName: string;
}

interface Report {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  status: 'draft' | 'published';
  publishedAt: string;
  pdfs: ReportPdf[];
}

const PDF_LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  dari: 'Dari',
  pashto: 'Pashto',
};

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

  const adminData = useCmsData<Record<string, any>>('programs');
  const homepageData = useCmsData<Record<string, any>>('homepage');
  const reportsData = useCmsData<Report[]>('reports');

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

  const programs: { id: string; image: string; title: string; description: string; theme: 'primary' | 'secondary'; type: 'program' | 'report'; pdfs: ReportPdf[] }[] = adminData?.programs?.length
    ? adminData.programs
        .filter((p: any) => p.status === 'active' && p.featured)
        .slice(0, 4)
        .map((p: any, i: number) => ({
          id: p.slug || p.id,
          image: p.imageUrl || PROGRAMS[i]?.image || '',
          title: p.title,
          description: p.shortDescription,
          theme: i % 2 === 1 ? ('primary' as const) : ('secondary' as const),
          type: 'program' as const,
          pdfs: [] as ReportPdf[],
        }))
    : PROGRAMS.map(p => ({ ...p, type: 'program' as const, pdfs: [] as ReportPdf[] }));

  const publishedReports = (Array.isArray(reportsData) ? reportsData : [])
    .filter(r => r.status === 'published')
    .map((r, i) => ({
      id: r.id,
      image: r.imageUrl,
      title: r.title,
      description: r.excerpt,
      theme: (i % 2 === 0 ? 'secondary' : 'primary') as 'primary' | 'secondary',
      type: 'report' as const,
      pdfs: r.pdfs || [],
    }));

  const allItems = [...programs, ...publishedReports].slice(0, 6);
  const totalCount = programs.length + publishedReports.length;

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
        <div className="mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className={`mb-4 inline-block ${progTitleBg} px-8 py-6`}>
              <h2 className="text-4xl font-bold text-white">
                {progTitle}
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              {progSubtitle}
            </p>
          </div>
          {totalCount > 6 && (
            <Link
              href={`${localePrefix}/OurImpactPrograms`}
              className="inline-flex h-10 items-center justify-center gap-2 bg-wrf-purple hover:bg-wrf-purple/90 text-white px-6 py-2 text-sm font-semibold transition-colors shrink-0 self-start sm:self-center"
            >
              {t('programs.viewAll') || 'View All'}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col rounded-none bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {item.image ? (
                  <img
                    src={encodeURI(item.image)}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-wrf-purple flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    </svg>
                  </div>
                )}
                {item.type === 'report' && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-wrf-coral">
                      {t('programs.filter.reports') || 'Report'}
                    </span>
                  </div>
                )}
              </div>
              <div
                className={`flex flex-1 flex-col p-6 ${
                  item.type === 'report' ? 'bg-wrf-black' :
                  item.theme === 'primary' ? 'bg-wrf-black' : 'bg-wrf-purple'
                }`}
              >
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white transition-opacity group-hover:opacity-90">
                    {item.title}
                  </h3>
                  <p className="mb-4 flex-grow text-sm leading-relaxed text-white/80 line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <div className="mt-auto space-y-3">
                  {/* PDF download buttons for reports */}
                  {item.type === 'report' && item.pdfs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.pdfs.map(pdf => (
                        <a
                          key={pdf.language}
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                          {PDF_LANGUAGE_LABELS[pdf.language] || pdf.language}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Learn More for programs */}
                  {item.type === 'program' && (
                    <Link
                      href={`${localePrefix}/ProgramPage?slug=${item.id}`}
                      className={`inline-flex h-9 items-center justify-center gap-1 rounded-none px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        item.theme === 'primary'
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
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All button at bottom when total > 6 */}
        {totalCount > 6 && (
          <div className="mt-12 text-center">
            <Link
              href={`${localePrefix}/OurImpactPrograms`}
              className="inline-flex h-12 items-center justify-center gap-2 bg-wrf-purple hover:bg-wrf-purple/90 text-white px-8 py-3 text-base font-semibold transition-colors"
            >
              {t('programs.viewAll') || 'View All Programs & Reports'}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
