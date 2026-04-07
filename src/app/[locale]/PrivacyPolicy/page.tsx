'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function PrivacyPolicyPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t, locale } = useTranslation();

  const articles: Array<{
    title: string;
    bgClass: string;
    content: string;
  }> = [
    {
      title: t('privacy.article1.title'),
      bgClass: 'bg-wrf-black',
      content: t('privacy.article1.content'),
    },
    {
      title: t('privacy.article2.title'),
      bgClass: 'bg-wrf-purple',
      content: t('privacy.article2.content'),
    },
    {
      title: t('privacy.article3.title'),
      bgClass: 'bg-wrf-coral',
      content: t('privacy.article3.content'),
    },
    {
      title: t('privacy.article4.title'),
      bgClass: 'bg-wrf-black',
      content: t('privacy.article4.content'),
    },
    {
      title: t('privacy.article5.title'),
      bgClass: 'bg-wrf-black',
      content: t('privacy.article5.content'),
    },
    {
      title: t('privacy.article6.title'),
      bgClass: 'bg-wrf-purple',
      content: t('privacy.article6.content'),
    },
    {
      title: t('privacy.article7.title'),
      bgClass: 'bg-wrf-coral',
      content: t('privacy.article7.content'),
    },
    {
      title: t('privacy.article8.title'),
      bgClass: 'bg-wrf-footer-mauve',
      content: t('privacy.article8.content'),
    },
  ];

  const adminData = useCmsData<Record<string, any>>('privacy-policy');

  const POLICY_BG_MAP: Record<string, string> = {
    primary: 'bg-wrf-black',
    secondary: 'bg-wrf-purple',
    accent: 'bg-wrf-coral',
    support: 'bg-wrf-footer-mauve',
  };

  const displayArticles = adminData && adminData.articles?.length > 0
    ? adminData.articles.map((a: any) => ({
        title: a.title,
        bgClass: a.bgClass || POLICY_BG_MAP[a.backgroundColor] || 'bg-wrf-black',
        content: a.content,
      }))
    : articles;

  const pageTitle = adminData?.pageTitle || t('privacy.hero.title');
  const introduction = adminData?.introduction;
  const introductionIsHtml = typeof introduction === 'string' && (introduction.trim().startsWith('<'));
  const lastUpdatedRaw = adminData?.lastUpdated;

  function formatLastUpdated(dateStr: string | undefined): string {
    if (!dateStr) return t('privacy.lastUpdated');
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return `Last Updated: ${dateStr}`;
      return `Last Updated: ${d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`;
    } catch {
      return `Last Updated: ${dateStr}`;
    }
  }

  return (
    <div className="bg-gray-50">
      {/* Hero - bg-primary (black) */}
      <section className="bg-wrf-black py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            {pageTitle}
          </h1>
          <div className="max-w-4xl text-lg leading-relaxed text-white/80">
            {introductionIsHtml ? (
              <div dangerouslySetInnerHTML={{ __html: introduction }} />
            ) : (
              <p>{introduction || t('privacy.hero.description')}</p>
            )}
          </div>
          <p className="mt-6 text-sm text-white/60">{formatLastUpdated(lastUpdatedRaw)}</p>
        </div>
      </section>

      {/* Accordion articles */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {displayArticles.map((article: any, index: number) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={article.title}
                  className="overflow-hidden rounded-none shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`flex w-full items-center justify-between p-6 text-left text-white transition-colors duration-200 ${article.bgClass}`}
                  >
                    <h3 className="text-lg font-semibold leading-tight">
                      {article.title}
                    </h3>
                    <span
                      className="ml-4 shrink-0 transition-transform"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    >
                      <ChevronDown className="h-6 w-6" />
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      className="border-t border-gray-200 bg-white p-6 text-wrf-black prose prose-p:leading-relaxed prose-ul:my-2 prose-li:my-0.5 max-w-none"
                      dangerouslySetInnerHTML={{ __html: article.content || '' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
