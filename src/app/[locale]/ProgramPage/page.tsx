'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { useTranslation } from '@/lib/TranslationContext';

const PEACEBUILDING_HERO_BG =
  '/images/GettyImages-1232002648.jpg';
const PEACEBUILDING_HERO_OVERLAY =
  '/images/Element-2-03-scaled.png';
const PEACEBUILDING_HANIFA_IMAGE =
  '/images/IMG_3571.jpeg';

const PEACEBUILDING_GALLERY_IMAGES = [
  '/images/1.jpeg',
  '/images/2.jpeg',
  '/images/4.jpeg',
  '/images/7.jpeg',
  '/images/WhatsApp-Image-2025-10-25-at-15.48.55-rotated.jpeg',
  '/images/9.jpeg',
];

// Legal Empowerment program
const LEGAL_HERO_BG =
  '/images/Hearing%20ICJ%20South%20Africa%20versus%20Israel%2011-12%20Jan%202024%20Low%20res.jpg';
const LEGAL_HERO_OVERLAY =
  '/images/Element-2-03-scaled.png';
const LEGAL_AISHA_IMAGE =
  '/images/pexels-ekaterina-bolovtsova-6077181-scaled-1.jpg';

// Digital Transformation and Open Gender Data program
const DIGITAL_SLUG = 'Digital-Transformation-and -Open -Gender -Data';
const DIGITAL_HERO_BG =
  '/images/freedom-of-movement-for-afghan-women-1920x1002-en.avif';
const DIGITAL_HERO_OVERLAY =
  '/images/Element-2-03-scaled.png';

// Representation and Advocacy program
const REPRESENTATION_HERO_BG =
  '/images/12.jpg';
const REPRESENTATION_HERO_OVERLAY =
  '/images/Element-2-03-scaled.png';

const REPRESENTATION_GALLERY_IMAGES = [
  '/images/11.jpg',
  '/images/12.jpg',
  '/images/5.jpeg',
  '/images/6.jpeg',
];

function Icon({ name }: { name: string }) {
  const cls = 'h-3 w-3 shrink-0';
  switch (name) {
    case 'gallery':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect width="18" height="14" x="3" y="3" rx="2" />
          <path d="M4 21h1" /><path d="M9 21h1" /><path d="M14 21h1" /><path d="M19 21h1" />
        </svg>
      );
    case 'chart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
        </svg>
      );
    case 'message':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'users':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'download':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      );
    case 'help':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
        </svg>
      );
    case 'camera':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      );
    case 'map':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function OtherProgramsSidebar({ currentSlug }: { currentSlug: string }) {
  const { t } = useTranslation();

  const otherPrograms = [
    {
      slug: 'legal-empowerment-international-accountability',
      title: t('programs.legal.title'),
      description: t('programs.legal.description'),
    },
    {
      slug: 'peacebuilding-social-cohesion',
      title: t('programs.peacebuilding.title'),
      description: t('programs.peacebuilding.description'),
    },
    {
      slug: 'Digital-Transformation-and -Open -Gender -Data',
      title: t('programs.digital.title'),
      description: t('programs.digital.description'),
    },
    {
      slug: 'representation-advocacy',
      title: t('programs.advocacy.title'),
      description: t('programs.advocacy.description'),
    },
  ];

  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-24 space-y-6">
        <div className="bg-wrf-footer-mauve p-6 shadow-lg">
          <h3 className="mb-6 border-b-2 border-white pb-2 text-xl font-bold text-white">
            {t('programPage.exploreOther')}
          </h3>
          <div className="space-y-4">
            {otherPrograms.filter((p) => p.slug !== currentSlug).map((prog) => (
              <Link
                key={prog.slug}
                href={`/ProgramPage?slug=${encodeURIComponent(prog.slug)}`}
                className="block bg-white p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 text-sm font-semibold text-wrf-black">{prog.title}</h4>
                <p className="line-clamp-2 text-sm text-gray-600">{prog.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function LegalEmpowermentContent({ adminProgram }: { adminProgram?: any }) {
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navSections = [
    { id: 'images', label: t('programPage.images'), icon: 'gallery' },
    { id: 'impact_metrics', label: t('programPage.ourImpact'), icon: 'chart' },
    { id: 'stories', label: t('programPage.beneficiaryStories'), icon: 'message' },
    { id: 'partners', label: t('programPage.partnersAndSupporters'), icon: 'users' },
    { id: 'resources', label: t('programPage.downloadableResources'), icon: 'download' },
    { id: 'faq', label: t('programPage.faq'), icon: 'help' },
    { id: 'behind_scenes', label: t('programPage.behindTheScenes'), icon: 'camera' },
    { id: 'map', label: t('programPage.programAreas'), icon: 'map' },
  ];

  const faqItems = [
    { question: t('program.legal.faq1.q'), answer: t('program.legal.faq1.a') },
    { question: t('program.legal.faq2.q'), answer: t('program.legal.faq2.a') },
  ];

  const impactStats = [
    { value: t('program.legal.impact1.value'), label: t('program.legal.impact1.label') },
    { value: t('program.legal.impact2.value'), label: t('program.legal.impact2.label') },
    { value: t('program.legal.impact3.value'), label: t('program.legal.impact3.label') },
    { value: t('program.legal.impact4.value'), label: t('program.legal.impact4.label') },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero - bg-primary (black) */}
      <section
        className="relative bg-cover bg-center py-16 md:py-24"
        style={{ backgroundImage: `url(${LEGAL_HERO_BG})` }}
      >
        <div className="hidden md:block absolute top-0 right-0 h-full w-2/5 bg-cover bg-center" style={{ clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)', backgroundImage: `url(${LEGAL_HERO_OVERLAY})` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="bg-wrf-black p-8 shadow-2xl">
              <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                {adminProgram?.title || t('program.legal.title')}
              </h1>
              <p className="text-lg leading-relaxed text-white/90">
                {adminProgram?.description || t('program.legal.heroDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <section className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-start gap-2">
            {navSections.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="flex items-center gap-2 bg-wrf-coral px-4 py-2 text-sm font-medium text-white shadow-md transition-shadow hover:shadow-lg"
              >
                <Icon name={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {/* Introduction */}
            <div id="introduction" className="bg-wrf-coral p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">
                {t('program.legal.introTitle')}
              </h2>
              <div className="text-base leading-relaxed text-wrf-black">
                {t('program.legal.introDesc')}
              </div>
            </div>

            {/* Quote block */}
            <div className="relative overflow-hidden bg-wrf-footer-mauve p-8 shadow-lg">
              <div className="absolute left-0 top-0 h-full w-1 bg-wrf-coral" aria-hidden />
              <div className="grid items-center gap-6 md:grid-cols-4">
                <div className="md:col-span-1">
                  <div className="mx-auto h-20 w-20">
                    <img
                      src={LEGAL_AISHA_IMAGE}
                      alt={t('program.legal.quoteAuthor')}
                      className="h-full w-full rounded-full border-4 border-wrf-coral object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <blockquote className="mb-4 text-lg italic text-white">
                    &quot;{t('program.legal.quote')}&quot;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 w-8 bg-wrf-coral" />
                    <div>
                      <p className="font-bold text-white">{t('program.legal.quoteAuthor')}</p>
                      <p className="text-sm text-white opacity-90">{t('program.legal.quoteRole')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div id="main_content" className="bg-white p-8 shadow-lg">
              <div className="prose max-w-none text-wrf-black">
                <p>
                  {t('program.legal.mainContent')}
                </p>
                <h3 className="mt-6">{t('program.legal.approach')}</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li dangerouslySetInnerHTML={{ __html: t('program.legal.approach1') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('program.legal.approach2') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('program.legal.approach3') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('program.legal.approach4') }} />
                </ul>
                <p className="mt-4">
                  {t('program.legal.mainClosing')}
                </p>
              </div>
            </div>

            {/* Images */}
            <div id="images" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.images')}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="aspect-video overflow-hidden">
                  <img src="/images/Hearing%20ICJ%20South%20Africa%20versus%20Israel%2011-12%20Jan%202024%20Low%20res.jpg" alt="ICJ Hearing" className="h-full w-full object-cover" />
                </div>
                <div className="aspect-video overflow-hidden">
                  <img src="/images/5.jpeg" alt="Legal proceedings" className="h-full w-full object-cover" />
                </div>
                <div className="aspect-video overflow-hidden">
                  <img src="/images/6.jpeg" alt="Legal team at work" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            {/* Impact metrics */}
            <div id="impact_metrics" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.ourImpact')}</h2>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {impactStats.map((item) => (
                  <div key={item.label} className="bg-wrf-coral p-6 text-center text-white">
                    <div className="mb-2 text-3xl font-bold">{item.value}</div>
                    <div className="text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Areas */}
            <div id="map" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.programAreas')}</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                <div className="bg-wrf-purple p-3 text-center text-sm text-white shadow-sm">Mazar-i-Sharif</div>
              </div>
            </div>

            {/* Beneficiary Stories */}
            <div id="stories" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.beneficiaryStories')}</h2>
              <div className="grid gap-6 lg:grid-cols-1">
                <div className="bg-wrf-purple p-8 text-white shadow-md">
                  <p className="mb-4 text-lg italic">
                    &quot;{t('program.legal.story')}&quot;
                  </p>
                  <p className="font-bold">{t('program.legal.storyAuthor')}</p>
                  <p className="text-sm">{t('program.legal.storyRole')}</p>
                </div>
              </div>
            </div>

            {/* Partners & Supporters */}
            <div id="partners" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.partnersAndSupporters')}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex flex-col items-center justify-center border border-gray-200 bg-wrf-black p-4 shadow-sm">
                  <span className="mb-2 text-2xl font-bold text-white">ICJ</span>
                  <p className="text-center text-sm font-medium">{t('program.legal.partner1')}</p>
                </div>
              </div>
            </div>

            {/* Downloadable Resources */}
            <div id="resources" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.downloadableResources')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <span className="font-medium">{t('program.legal.resource1')}</span>
                </div>
              </div>
            </div>

            {/* Behind the Scenes */}
            <div id="behind_scenes" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.behindTheScenes')}</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 p-4 shadow-sm">
                  <h3 className="mb-2 text-lg font-semibold text-wrf-black">{t('program.legal.behind')}</h3>
                  <p className="text-wrf-gray-text">{t('program.legal.behindDesc')}</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div id="faq" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.faq')}</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="border border-gray-200 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="flex w-full items-center justify-between bg-white p-4 text-left transition-colors hover:bg-gray-50"
                      >
                        <span className="font-bold text-wrf-black">{item.question}</span>
                        <span className="transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4 text-wrf-black">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <OtherProgramsSidebar currentSlug="legal-empowerment-international-accountability" />
        </div>
      </div>
    </div>
  );
}

function DigitalTransformationContent({ adminProgram }: { adminProgram?: any }) {
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navSections = [
    { id: 'impact_metrics', label: t('programPage.ourImpact'), icon: 'chart' },
    { id: 'stories', label: t('programPage.beneficiaryStories'), icon: 'message' },
    { id: 'partners', label: t('programPage.partnersAndSupporters'), icon: 'users' },
    { id: 'resources', label: t('programPage.downloadableResources'), icon: 'download' },
    { id: 'faq', label: t('programPage.faq'), icon: 'help' },
    { id: 'behind_scenes', label: t('programPage.behindTheScenes'), icon: 'camera' },
  ];

  const faqItems = [
    { question: t('program.digital.faq1.q'), answer: t('program.digital.faq1.a') },
  ];

  const impactStats = [
    { value: t('program.digital.impact1.value'), label: t('program.digital.impact1.label') },
    { value: t('program.digital.impact2.value'), label: t('program.digital.impact2.label') },
    { value: t('program.digital.impact3.value'), label: t('program.digital.impact3.label') },
    { value: t('program.digital.impact4.value'), label: t('program.digital.impact4.label') },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero - bg-secondary (purple) */}
      <section
        className="relative bg-cover bg-center py-16 md:py-24"
        style={{ backgroundImage: `url(${DIGITAL_HERO_BG})` }}
      >
        <div className="hidden md:block absolute top-0 right-0 h-full w-2/5 bg-cover bg-center" style={{ clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)', backgroundImage: `url(${DIGITAL_HERO_OVERLAY})` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="bg-wrf-purple p-8 shadow-2xl">
              <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                {adminProgram?.title || t('program.digital.title')}
              </h1>
              <p className="text-lg leading-relaxed text-white/90">
                {adminProgram?.description || t('program.digital.introDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <section className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-start gap-2">
            {navSections.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="flex items-center gap-2 bg-wrf-coral px-4 py-2 text-sm font-medium text-white shadow-md transition-shadow hover:shadow-lg"
              >
                <Icon name={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {/* Introduction */}
            <div id="introduction" className="bg-gray-50 p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">
                {t('program.digital.title')}
              </h2>
              <div className="text-base leading-relaxed text-wrf-black">
                {t('program.digital.introDesc')}
              </div>
            </div>

            {/* Impact metrics */}
            <div id="impact_metrics" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.ourImpact')}</h2>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {impactStats.map((item) => (
                  <div key={item.label} className="bg-wrf-coral p-6 text-center text-white">
                    <div className="mb-2 text-3xl font-bold">{item.value}</div>
                    <div className="text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficiary Stories */}
            <div id="stories" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.beneficiaryStories')}</h2>
              <div className="grid gap-6 lg:grid-cols-1">
                <div className="bg-wrf-purple p-8 text-white shadow-md">
                  <p className="mb-4 text-lg italic">
                    &quot;{t('program.digital.story')}&quot;
                  </p>
                  <p className="font-bold">{t('program.digital.storyAuthor')}</p>
                  <p className="text-sm">{t('program.digital.storyRole')}</p>
                </div>
              </div>
            </div>

            {/* Partners & Supporters */}
            <div id="partners" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.partnersAndSupporters')}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex flex-col items-center justify-center border border-gray-200 bg-wrf-coral p-4 shadow-sm">
                  <span className="mb-2 text-lg font-bold text-white">Partner</span>
                  <p className="text-center text-sm font-medium">{t('program.digital.partner1')}</p>
                </div>
              </div>
            </div>

            {/* Downloadable Resources */}
            <div id="resources" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.downloadableResources')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <span className="font-medium">{t('program.digital.resource1')}</span>
                </div>
              </div>
            </div>

            {/* Behind the Scenes */}
            <div id="behind_scenes" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.behindTheScenes')}</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 p-4 shadow-sm">
                  <h3 className="mb-2 text-lg font-semibold text-wrf-black">{t('program.digital.behind')}</h3>
                  <p className="text-gray-700" />
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div id="faq" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.faq')}</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="border border-gray-200 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="flex w-full items-center justify-between bg-white p-4 text-left transition-colors hover:bg-gray-50"
                      >
                        <span className="font-bold text-wrf-black">{item.question}</span>
                        <span className="transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4 text-wrf-black">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <OtherProgramsSidebar currentSlug={DIGITAL_SLUG} />
        </div>
      </div>
    </div>
  );
}

function RepresentationAdvocacyContent({ adminProgram }: { adminProgram?: any }) {
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navSections = [
    { id: 'gallery', label: t('programPage.gallery'), icon: 'gallery' },
    { id: 'impact_metrics', label: t('programPage.ourImpact'), icon: 'chart' },
    { id: 'stories', label: t('programPage.beneficiaryStories'), icon: 'message' },
    { id: 'partners', label: t('programPage.partnersAndSupporters'), icon: 'users' },
    { id: 'resources', label: t('programPage.downloadableResources'), icon: 'download' },
    { id: 'faq', label: t('programPage.faq'), icon: 'help' },
    { id: 'behind_scenes', label: t('programPage.behindTheScenes'), icon: 'camera' },
  ];

  const faqItems = [
    { question: t('program.advocacy.faq1.q'), answer: t('program.advocacy.faq1.a') },
    { question: t('program.advocacy.faq2.q'), answer: t('program.advocacy.faq2.a') },
  ];

  const impactStats = [
    { value: t('program.advocacy.impact1.value'), label: t('program.advocacy.impact1.label') },
    { value: t('program.advocacy.impact2.value'), label: t('program.advocacy.impact2.label') },
    { value: t('program.advocacy.impact3.value'), label: t('program.advocacy.impact3.label') },
    { value: t('program.advocacy.impact4.value'), label: t('program.advocacy.impact4.label') },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero - bg-secondary (purple) */}
      <section
        className="relative bg-cover bg-center py-16 md:py-24"
        style={{ backgroundImage: `url(${REPRESENTATION_HERO_BG})` }}
      >
        <div className="hidden md:block absolute top-0 right-0 h-full w-2/5 bg-cover bg-center" style={{ clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)', backgroundImage: `url(${REPRESENTATION_HERO_OVERLAY})` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="bg-wrf-purple p-8 shadow-2xl">
              <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                {adminProgram?.title || t('program.advocacy.title')}
              </h1>
              <p className="text-lg leading-relaxed text-white/90">
                {adminProgram?.description || t('program.advocacy.heroDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <section className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-start gap-2">
            {navSections.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="flex items-center gap-2 bg-wrf-coral px-4 py-2 text-sm font-medium text-white shadow-md transition-shadow hover:shadow-lg"
              >
                <Icon name={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {/* Introduction + Main content */}
            <div id="introduction" className="bg-white p-8 shadow-lg">
              <p className="font-body text-base leading-relaxed text-wrf-black">
                {t('program.advocacy.mainContent')}
              </p>
            </div>

            <div id="main_content" className="bg-white p-8 shadow-lg">
              <h3 className="font-heading mb-4 text-xl font-bold text-wrf-black">{t('program.advocacy.approach')}</h3>
              <div className="font-body space-y-3 text-base leading-relaxed text-wrf-black">
                <p dangerouslySetInnerHTML={{ __html: t('program.advocacy.approach1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('program.advocacy.approach2') }} />
                <p dangerouslySetInnerHTML={{ __html: t('program.advocacy.approach3') }} />
                <p dangerouslySetInnerHTML={{ __html: t('program.advocacy.approach4') }} />
                <p dangerouslySetInnerHTML={{ __html: t('program.advocacy.approach5') }} />
              </div>
              <p className="font-body mt-6 text-base leading-relaxed text-wrf-black">
                {t('program.advocacy.mainClosing')}
              </p>
            </div>

            {/* Gallery */}
            <div id="gallery" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.gallery')}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {REPRESENTATION_GALLERY_IMAGES.map((src, i) => (
                  <div key={i} className="aspect-square cursor-pointer overflow-hidden shadow-md transition-shadow hover:shadow-xl">
                    <img
                      src={src}
                      alt={`${t('program.advocacy.title')} gallery image ${i + 1}`}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Impact metrics */}
            <div id="impact_metrics" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.ourImpact')}</h2>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {impactStats.map((item) => (
                  <div key={item.label} className="bg-wrf-coral p-6 text-center text-white">
                    <div className="mb-2 text-3xl font-bold">{item.value}</div>
                    <div className="text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficiary Stories */}
            <div id="stories" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.beneficiaryStories')}</h2>
              <div className="grid gap-6 lg:grid-cols-1">
                <div className="bg-wrf-purple p-8 text-white shadow-md">
                  <p className="mb-4 text-lg italic">
                    &quot;{t('program.advocacy.story1')}&quot;
                  </p>
                  <p className="font-bold">{t('program.advocacy.story1Author')}</p>
                  <p className="text-sm">{t('program.advocacy.story1Role')}</p>
                </div>
                <div className="bg-wrf-purple p-8 text-white shadow-md">
                  <p className="mb-4 text-lg italic">
                    &quot;{t('program.advocacy.story2')}&quot;
                  </p>
                  <p className="font-bold">{t('program.advocacy.story2Author')}</p>
                  <p className="text-sm">{t('program.advocacy.story2Role')}</p>
                </div>
              </div>
            </div>

            {/* Partners & Supporters */}
            <div id="partners" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.partnersAndSupporters')}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex flex-col items-center justify-center border border-gray-200 bg-[#003399] p-4 shadow-sm">
                  <span className="mb-2 text-lg font-bold text-white">EU Parliament</span>
                  <p className="text-center text-sm font-medium">European Parliament</p>
                </div>
                <div className="flex flex-col items-center justify-center border border-gray-200 bg-wrf-purple p-4 shadow-sm">
                  <span className="mb-2 text-lg font-bold text-white">WILPF</span>
                  <p className="text-center text-sm font-medium">Women&apos;s International League</p>
                </div>
              </div>
            </div>

            {/* Downloadable Resources */}
            <div id="resources" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.downloadableResources')}</h2>
              <div className="space-y-4">
                {[t('program.advocacy.resource1'), t('program.advocacy.resource2'), t('program.advocacy.resource3')].map((title) => (
                  <div key={title} className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 shadow-sm">
                    <span className="font-medium">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Behind the Scenes */}
            <div id="behind_scenes" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('programPage.behindTheScenes')}</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 p-4 shadow-sm">
                  <h3 className="mb-2 text-lg font-semibold text-wrf-black">{t('program.advocacy.behind')}</h3>
                  <p className="text-gray-700" />
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div id="faq" className="bg-white p-8 shadow-lg">
              <h2 className="font-heading mb-6 text-2xl font-bold text-wrf-black">{t('programPage.faq')}</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="border border-gray-200 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="flex w-full items-center justify-between bg-white p-4 text-left transition-colors hover:bg-gray-50"
                      >
                        <span className="font-bold text-wrf-black">{item.question}</span>
                        <span className="transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                          <p className="font-body text-base leading-relaxed text-gray-700">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <OtherProgramsSidebar currentSlug="representation-advocacy" />
        </div>
      </div>
    </div>
  );
}

function PeacebuildingContent({ adminProgram }: { adminProgram?: any }) {
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navSections = [
    { id: 'gallery', label: t('program.peace.nav.gallery'), icon: 'gallery' },
    { id: 'impact_metrics', label: t('program.peace.nav.impact'), icon: 'chart' },
    { id: 'stories', label: t('program.peace.nav.stories'), icon: 'message' },
    { id: 'partners', label: t('program.peace.nav.partners'), icon: 'users' },
    { id: 'resources', label: t('program.peace.nav.resources'), icon: 'download' },
    { id: 'faq', label: t('program.peace.nav.faq'), icon: 'help' },
    { id: 'behind_scenes', label: t('program.peace.nav.behind'), icon: 'camera' },
  ];

  const faqItems = [
    { question: t('program.peace.faq1.q'), answer: t('program.peace.faq1.a') },
    { question: t('program.peace.faq2.q'), answer: t('program.peace.faq2.a') },
  ];

  const impactStats = [
    { value: t('program.peace.impact1.value'), label: t('program.peace.impact1.label') },
    { value: t('program.peace.impact2.value'), label: t('program.peace.impact2.label') },
    { value: t('program.peace.impact3.value'), label: t('program.peace.impact3.label') },
    { value: t('program.peace.impact4.value'), label: t('program.peace.impact4.label') },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero - bg-secondary (purple) */}
      <section
        className="relative bg-cover bg-center py-16 md:py-24"
        style={{ backgroundImage: `url(${PEACEBUILDING_HERO_BG})` }}
      >
        <div className="hidden md:block absolute top-0 right-0 h-full w-2/5 bg-cover bg-center" style={{ clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)', backgroundImage: `url(${PEACEBUILDING_HERO_OVERLAY})` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="bg-wrf-purple p-8 shadow-2xl">
              <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                {adminProgram?.title || t('program.peace.heroTitle')}
              </h1>
              <p className="text-lg leading-relaxed text-white/90">
                {adminProgram?.description || t('program.peace.heroDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <section className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-start gap-2">
            {navSections.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="flex items-center gap-2 bg-wrf-coral px-4 py-2 text-sm font-medium text-white shadow-md transition-shadow hover:shadow-lg"
              >
                <Icon name={icon} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {/* Introduction */}
            <div id="introduction" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">
                {t('program.peace.introTitle')}
              </h2>
              <div className="text-base leading-relaxed text-wrf-black">
                {t('program.peace.introDesc')}
              </div>
            </div>

            {/* Quote block */}
            <div className="relative overflow-hidden bg-wrf-black p-8 shadow-lg">
              <div className="absolute left-0 top-0 h-full w-1 bg-wrf-coral" aria-hidden />
              <div className="grid items-center gap-6 md:grid-cols-4">
                <div className="md:col-span-1">
                  <div className="mx-auto h-20 w-20">
                    <img
                      src={PEACEBUILDING_HANIFA_IMAGE}
                      alt={t('program.peace.quoteAuthor')}
                      className="h-full w-full rounded-full border-4 border-wrf-coral object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <blockquote className="mb-4 text-lg italic text-white">
                    &quot;{t('program.peace.quote')}&quot;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 w-8 bg-wrf-coral" />
                    <div>
                      <p className="font-bold text-white">{t('program.peace.quoteAuthor')}</p>
                      <p className="text-sm text-white opacity-90">{t('program.peace.quoteRole')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div id="main_content" className="bg-gray-50 p-8 shadow-lg">
              <div className="prose max-w-none text-wrf-black">
                <h3>{t('program.peace.approach')}</h3>
                <p>{t('program.peace.approachDesc')}</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li dangerouslySetInnerHTML={{ __html: t('program.peace.approach1') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('program.peace.approach2') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('program.peace.approach3') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('program.peace.approach4') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('program.peace.approach5') }} />
                </ul>
                <h3 className="mt-6">{t('program.peace.cohesion')}</h3>
                <p>{t('program.peace.cohesionDesc')}</p>
              </div>
            </div>

            {/* Peace in Action */}
            <div id="gallery" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('program.peace.nav.gallery')}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {PEACEBUILDING_GALLERY_IMAGES.map((src, i) => (
                  <div key={i} className="aspect-square cursor-pointer overflow-hidden shadow-md transition-shadow hover:shadow-xl">
                    <img
                      src={src}
                      alt={`${t('program.peace.heroTitle')} gallery image ${i + 1}`}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Our Peace Impact */}
            <div id="impact_metrics" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('program.peace.nav.impact')}</h2>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {impactStats.map((item) => (
                  <div key={item.label} className="bg-wrf-coral p-6 text-center text-white">
                    <div className="mb-2 text-3xl font-bold">{item.value}</div>
                    <div className="text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voices of Peace */}
            <div id="stories" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('program.peace.nav.stories')}</h2>
              <div className="grid gap-6 lg:grid-cols-1">
                <div className="bg-wrf-purple p-8 text-white shadow-md">
                  <p className="mb-4 text-lg italic">
                    &quot;{t('program.peace.story1')}&quot;
                  </p>
                  <p className="font-bold">{t('program.peace.story1Author')}</p>
                  <p className="text-sm">{t('program.peace.story1Role')}</p>
                </div>
                <div className="bg-wrf-purple p-8 text-white shadow-md">
                  <p className="mb-4 text-lg italic">
                    &quot;{t('program.peace.story2')}&quot;
                  </p>
                  <p className="font-bold">{t('program.peace.story2Author')}</p>
                  <p className="text-sm">{t('program.peace.story2Role')}</p>
                </div>
              </div>
            </div>

            {/* Peace Partners */}
            <div id="partners" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('program.peace.nav.partners')}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex flex-col items-center justify-center border border-gray-200 bg-[#0066cc] p-4 shadow-sm">
                  <span className="mb-2 text-xl font-bold text-white">UN PBF</span>
                  <p className="text-center text-sm font-medium">{t('program.peace.partner1')}</p>
                </div>
                <div className="flex flex-col items-center justify-center border border-gray-200 bg-[#228B22] p-4 shadow-sm">
                  <span className="mb-2 text-xl font-bold text-white">IPI</span>
                  <p className="text-center text-sm font-medium">{t('program.peace.partner2')}</p>
                </div>
              </div>
            </div>

            {/* Peacebuilding Resources */}
            <div id="resources" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('program.peace.nav.resources')}</h2>
              <div className="space-y-4">
                {[t('program.peace.resource1'), t('program.peace.resource2'), t('program.peace.resource3')].map((title) => (
                  <div key={title} className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 shadow-sm">
                    <span className="font-medium">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Building Peace */}
            <div id="behind_scenes" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('program.peace.nav.behind')}</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 p-4 shadow-sm">
                  <h3 className="mb-2 text-lg font-semibold text-wrf-black">{t('program.peace.behind')}</h3>
                  <p className="text-wrf-gray-text">{t('program.peace.behindDesc')}</p>
                </div>
              </div>
            </div>

            {/* Peacebuilding FAQ */}
            <div id="faq" className="bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-wrf-black">{t('program.peace.nav.faq')}</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="border border-gray-200 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="flex w-full items-center justify-between bg-white p-4 text-left transition-colors hover:bg-gray-50"
                      >
                        <span className="font-bold text-wrf-black">{item.question}</span>
                        <span className="transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4 text-wrf-black">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <OtherProgramsSidebar currentSlug="peacebuilding-social-cohesion" />
        </div>
      </div>
    </div>
  );
}

function ProgramPageInner() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') ?? '';
  const [adminPrograms, setAdminPrograms] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/data/programs', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d && Array.isArray(d.programs) && d.programs.length > 0) {
          setAdminPrograms(d.programs);
        } else if (d && Array.isArray(d) && d.length > 0) {
          setAdminPrograms(d);
        }
      })
      .catch(() => {});
  }, []);

  const adminProgram = adminPrograms?.find(
    (p: any) => p.slug === slug || p.slug === slug.toLowerCase()
  ) ?? null;

  if (slug === 'legal-empowerment-international-accountability') {
    return <LegalEmpowermentContent adminProgram={adminProgram} />;
  }
  if (slug === DIGITAL_SLUG || slug === 'digital-transformation-open-gender-data') {
    return <DigitalTransformationContent adminProgram={adminProgram} />;
  }
  if (slug === 'representation-advocacy') {
    return <RepresentationAdvocacyContent adminProgram={adminProgram} />;
  }
  if (slug === 'peacebuilding-social-cohesion') {
    return <PeacebuildingContent adminProgram={adminProgram} />;
  }

  return (
    <div className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-wrf-black">{t('programPage.notFound')}</h1>
        <p className="mt-2 text-gray-600">
          {slug || '(no slug)'}
        </p>
        <Link
          href="/ProgramPage?slug=peacebuilding-social-cohesion"
          className="mt-6 inline-block bg-wrf-coral px-6 py-2 font-medium text-white hover:opacity-90"
        >
          {t('programs.peacebuilding.title')}
        </Link>
      </div>
    </div>
  );
}

export default function ProgramPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-gray-50" />}>
      <ProgramPageInner />
    </Suspense>
  );
}
