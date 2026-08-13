'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
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

export default function ReportDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const { t } = useTranslation();
  const slug = params.slug as string;

  const reportsData = useCmsData<Report[]>('reports');
  const reports = Array.isArray(reportsData) ? reportsData : [];
  const report = reports.find(r => r.slug === slug && r.status === 'published');

  if (!reportsData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Report not found</h1>
        <Link href={`${localePrefix}/OurImpactPrograms`} className="text-wrf-purple hover:underline font-semibold">
          &larr; Back to Our Impact Programs
        </Link>
      </div>
    );
  }

  const otherReports = reports.filter(r => r.slug !== slug && r.status === 'published').slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative">
        {report.imageUrl ? (
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <img src={report.imageUrl} alt={report.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto max-w-4xl w-full px-4 pb-8 sm:px-6 lg:px-8">
                <span className="inline-block bg-wrf-coral px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-3">
                  {t('programs.filter.reports') || 'Report'}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{report.title}</h1>
                {report.publishedAt && (
                  <p className="mt-2 text-white/70 text-sm">{report.publishedAt}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-wrf-purple py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <span className="inline-block bg-wrf-coral px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-3">
                {t('programs.filter.reports') || 'Report'}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{report.title}</h1>
              {report.publishedAt && (
                <p className="mt-2 text-white/70 text-sm">{report.publishedAt}</p>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* PDF Downloads */}
            {report.pdfs && report.pdfs.length > 0 && (
              <div className="bg-white p-6 shadow-lg">
                <h2 className="text-lg font-bold text-wrf-black mb-4">
                  {t('programPage.downloadableResources') || 'Download Report'}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {report.pdfs.map(pdf => (
                    <a
                      key={pdf.language}
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex-shrink-0 h-10 w-10 bg-red-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 capitalize">{PDF_LANGUAGE_LABELS[pdf.language] || pdf.language}</p>
                        <p className="text-xs text-gray-500 truncate">{pdf.fileName}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-wrf-purple flex-shrink-0">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Excerpt */}
            {report.excerpt && (
              <div className="bg-wrf-purple p-6 shadow-lg">
                <p className="text-lg leading-relaxed text-white/90 italic">{report.excerpt}</p>
              </div>
            )}

            {/* Content */}
            {report.content && (
              <div className="bg-white p-8 shadow-lg">
                <div className="prose max-w-none text-wrf-black whitespace-pre-line">
                  {report.content}
                </div>
              </div>
            )}

            {/* Back link */}
            <div>
              <Link href={`${localePrefix}/OurImpactPrograms`} className="inline-flex items-center gap-2 text-wrf-purple hover:underline font-semibold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                {t('programs.viewAll') || 'View All Programs & Reports'}
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {otherReports.length > 0 && (
                <div className="bg-wrf-footer-mauve p-6 shadow-lg">
                  <h3 className="mb-6 border-b-2 border-white pb-2 text-xl font-bold text-white">
                    Other Reports
                  </h3>
                  <div className="space-y-4">
                    {otherReports.map(r => (
                      <Link
                        key={r.id}
                        href={`${localePrefix}/OurImpactPrograms/${r.slug}`}
                        className="block bg-white p-4 transition-shadow hover:shadow-md"
                      >
                        <h4 className="mb-1 text-sm font-semibold text-wrf-black">{r.title}</h4>
                        <p className="line-clamp-2 text-xs text-gray-600">{r.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
