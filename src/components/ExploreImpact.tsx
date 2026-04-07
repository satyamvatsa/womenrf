'use client';

import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

export default function ExploreImpact() {
  const { t } = useTranslation();

  const adminData = useCmsData<Record<string, any>>('homepage');

  const EI_BG_MAP: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  const showPagesShowcase = adminData?.showPagesShowcase !== undefined ? adminData.showPagesShowcase : true;
  const showcaseTitleBg = EI_BG_MAP[adminData?.pagesShowcaseTitleBg] || 'bg-wrf-black';
  const showcaseQuoteBg = EI_BG_MAP[adminData?.pagesShowcaseQuoteBg] || 'bg-wrf-coral';

  if (!showPagesShowcase) return null;

  return (
    <section id="impact" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <div className={`mb-4 inline-block ${showcaseTitleBg} px-8 py-6`}>
            <h2 className="text-4xl font-bold text-white">
              {adminData?.pagesShowcaseTitle || t('exploreImpact.title')}
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            {adminData?.pagesShowcaseSubtitle || t('exploreImpact.description')}
          </p>
        </div>
        <div className="grid items-stretch gap-8 lg:grid-cols-5">
          <div className={`relative flex flex-col justify-center ${showcaseQuoteBg} p-10 lg:col-span-2`}>
            <div className="mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={adminData?.pagesShowcaseQuoteAuthorImage || "/images/Hanifa_Girowal.jpeg"}
                alt=""
                className="mb-6 h-32 w-32 object-cover"
              />
            </div>
            <div className="relative">
              <div
                className="absolute -left-6 -top-6 select-none text-8xl font-bold leading-none text-white/90"
                aria-hidden
              >
                &ldquo;
              </div>
              <blockquote className="relative z-10 mb-6 pl-8 text-2xl italic leading-relaxed text-white">
                {adminData?.pagesShowcaseQuote || t('exploreImpact.quote')}
              </blockquote>
              <div
                className="absolute -bottom-2 right-0 select-none text-8xl font-bold leading-none text-white/90"
                aria-hidden
              >
                &rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
