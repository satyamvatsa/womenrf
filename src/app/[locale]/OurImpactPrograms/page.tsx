'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  content: string;
  imageUrl: string;
  status: 'draft' | 'published';
  publishedAt: string;
  pdfs: ReportPdf[];
}

function getLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && ['en', 'fa', 'ps'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '/en';
}

const PDF_LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  dari: 'Dari',
  pashto: 'Pashto',
};

const HERO_BG = '/images/GettyImages-1232002648.jpg';

const HARDCODED_PROGRAMS = [
  {
    slug: 'peacebuilding-social-cohesion',
    titleKey: 'programs.peacebuilding.title',
    descKey: 'programs.peacebuilding.description',
    image: '/Peacebuilding and Social Cohesion.jpg',
    type: 'program' as const,
  },
  {
    slug: 'legal-empowerment-international-accountability',
    titleKey: 'programs.legal.title',
    descKey: 'programs.legal.description',
    image: '/Legal Empowerment & International Accountability.jpg',
    type: 'program' as const,
  },
  {
    slug: 'digital-transformation-open-gender-data',
    titleKey: 'programs.digital.title',
    descKey: 'programs.digital.description',
    image: '/Digital Transformation and Open Gender Data.avif',
    type: 'program' as const,
  },
  {
    slug: 'representation-advocacy',
    titleKey: 'programs.advocacy.title',
    descKey: 'programs.advocacy.description',
    image: '/Representation and Advocacy.jpg',
    type: 'program' as const,
  },
];

type FilterType = 'all' | 'programs' | 'reports';

export default function OurImpactProgramsPage() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>('all');

  const reportsData = useCmsData<Report[]>('reports');
  const publishedReports = (Array.isArray(reportsData) ? reportsData : []).filter(r => r.status === 'published');

  const programs = HARDCODED_PROGRAMS.map(p => ({
    id: p.slug,
    title: t(p.titleKey),
    description: t(p.descKey),
    image: p.image,
    type: p.type,
    slug: p.slug,
    pdfs: [] as ReportPdf[],
    publishedAt: '',
  }));

  const reports = publishedReports.map(r => ({
    id: r.id,
    title: r.title,
    description: r.excerpt,
    image: r.imageUrl,
    type: 'report' as const,
    slug: r.slug,
    pdfs: r.pdfs || [],
    publishedAt: r.publishedAt,
  }));

  const allItems = filter === 'programs' ? programs
    : filter === 'reports' ? reports
    : [...programs, ...reports];

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('programs.filter.all') || 'All' },
    { key: 'programs', label: t('programs.filter.programs') || 'Programs' },
    { key: 'reports', label: t('programs.filter.reports') || 'Reports' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section
        className="relative bg-cover bg-center py-16 md:py-24"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="absolute inset-0 bg-wrf-purple/80" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            {t('programs.title')}
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90">
            {t('programs.description')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {filterButtons.map(fb => (
              <button
                key={fb.key}
                type="button"
                onClick={() => setFilter(fb.key)}
                className={`rounded-none px-5 py-2 text-sm font-semibold transition-colors ${
                  filter === fb.key
                    ? 'bg-wrf-purple text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {fb.label}
                <span className="ml-1 text-xs opacity-75">
                  ({fb.key === 'all' ? programs.length + reports.length
                    : fb.key === 'programs' ? programs.length
                    : reports.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {allItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No items found.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {allItems.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
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
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${
                        item.type === 'program' ? 'bg-wrf-purple' : 'bg-wrf-coral'
                      }`}>
                        {item.type === 'program' ? (t('programs.filter.programs') || 'Program') : (t('programs.filter.reports') || 'Report')}
                      </span>
                    </div>
                  </div>

                  <div className={`flex flex-1 flex-col p-6 ${
                    item.type === 'program' ? 'bg-wrf-purple' : 'bg-wrf-black'
                  }`}>
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-bold text-white transition-opacity group-hover:opacity-90">
                        {item.title}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-white/80 line-clamp-3">
                        {item.description}
                      </p>
                      {item.publishedAt && (
                        <p className="mb-3 text-xs text-white/60">{item.publishedAt}</p>
                      )}
                    </div>

                    <div className="mt-auto space-y-3">
                      {/* PDF download buttons */}
                      {item.pdfs.length > 0 && (
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

                      {/* Learn More link for programs */}
                      {item.type === 'program' && (
                        <Link
                          href={`${localePrefix}/ProgramPage?slug=${item.slug}`}
                          className="inline-flex h-9 items-center justify-center gap-1 bg-white text-wrf-purple hover:bg-gray-100 px-3 py-1.5 text-sm font-semibold transition-colors"
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
          )}
        </div>
      </section>
    </div>
  );
}
