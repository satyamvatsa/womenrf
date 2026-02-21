'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

const HERO_BG =
  '/images/00D0CA02-1516-4042-B101-FC127C88E162.jpg';

import AboutSectionNav from './AboutSectionNav';
import { useTranslation } from '@/lib/TranslationContext';

/** Maps admin-saved color names to actual CSS hex values */
const COLOR_MAP: Record<string, string> = {
  'primary': '#1a1a1a',
  'secondary': '#6B5B95',
  'accent': '#E07A7A',
  'white': '#ffffff',
  'wrf-black': '#1a1a1a',
  'wrf-purple': '#6B5B95',
  'wrf-coral': '#E07A7A',
  'wrf-footer-mauve': '#b88a9e',
};

function resolveColor(colorName: string | undefined, fallback: string): string {
  if (!colorName) return fallback;
  return COLOR_MAP[colorName] || colorName;
}

const DEFAULT_CORE_VALUES = [
  { id: '1', title: 'Equality & Justice', description: '', color: 'wrf-black' },
  { id: '2', title: 'Empowerment & Leadership', description: '', color: 'wrf-purple' },
  { id: '3', title: 'Community & Solidarity', description: '', color: 'wrf-coral' },
  { id: '4', title: 'Innovation & Sustainability', description: '', color: 'wrf-footer-mauve' },
];

const TEAM = [
  { name: 'Hanifa Girowal', role: 'Co-Founder & VP', img: '/images/Hanifa_Girowal.jpeg', bg: 'bg-wrf-coral' },
  { name: 'Shabnam Salehi', role: 'Co-Founder & President', img: '/images/Shabnam_Salehi.jpeg', bg: 'bg-wrf-purple' },
  { name: 'Morten Kjaerum', role: 'Board Member', img: '/images/1-Panelist-Morten-Kjaerum-Picture-1.jpg', bg: 'bg-wrf-purple' },
];

export default function AboutPage() {
  const { t, locale } = useTranslation();
  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  const [openValue, setOpenValue] = useState<string | null>(null);

  const toggleValue = useCallback((key: string) => {
    setOpenValue((prev) => (prev === key ? null : key));
  }, []);

  useEffect(() => {
    fetch('/api/data/about', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
  }, []);

  const TIMELINE = [
    {
      year: '2019',
      title: t('about.journey.2019.title'),
      description: t('about.journey.2019.description'),
    },
    {
      year: '2020',
      title: t('about.journey.2020.title'),
      description: t('about.journey.2020.description'),
    },
    {
      year: '2021',
      title: t('about.journey.2021.title'),
      description: t('about.journey.2021.description'),
    },
    {
      year: '2022',
      title: t('about.journey.2022.title'),
      description: t('about.journey.2022.description'),
    },
    {
      year: '2023',
      title: t('about.journey.2023.title'),
      description: t('about.journey.2023.description'),
    },
    {
      year: '2024',
      title: t('about.journey.2024.title'),
      description: t('about.journey.2024.description'),
    },
  ];

  const GET_INVOLVED_LINKS = [
    { href: '/Volunteer', label: t('about.getInvolved.volunteer'), bgClass: 'bg-wrf-black' },
    { href: '/Vacancies', label: t('about.getInvolved.careers'), bgClass: 'bg-wrf-purple' },
    { href: '/Partnership', label: t('about.getInvolved.partner'), bgClass: 'bg-wrf-coral' },
    { href: '/News', label: t('about.getInvolved.news'), bgClass: 'bg-wrf-footer-mauve' },
    { href: '/Contact', label: t('about.getInvolved.contact'), bgClass: 'bg-wrf-black' },
  ];

  return (
    <div className="bg-white">
      {/* Hero - matches reference layout */}
      <section
        id="hero"
        className="relative overflow-hidden bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <ScrollReveal variant="fade">
            <div className="inline-block bg-wrf-black px-8 py-6">
              <h1 className="mb-4 text-4xl font-bold text-white lg:text-6xl">
                {t('about.hero.title')}
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-white/90">
                {t('about.hero.description')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section nav - normal section, with border and font per attachment */}
      <AboutSectionNav />

      {/* Our Vision */}
      <section id="vision" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal variant="slideLeft" className="text-left">
              <div
                className="inline-block p-4"
                style={{ backgroundColor: resolveColor(adminData?.visionTitleBgColor, '#6B5B95') }}
              >
                <h2 className="text-3xl font-bold text-white">
                  {(locale === 'en' && adminData?.visionTitle) || 'Our Vision'}
                </h2>
              </div>
              <p className="mb-8 mt-6 max-w-3xl text-lg leading-relaxed text-gray-700">
                {(locale === 'en' && adminData?.visionContent) || 'A just and peaceful Afghanistan where women can exercise agency with pride, dignity and freedom.'}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="slideRight">
              <img
                src={adminData?.visionImageUrl || '/images/teams.jpeg'}
                alt="Our Vision"
                className="h-96 w-full object-cover shadow-2xl"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & History */}
      <section id="mission" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal variant="slideLeft" className="text-left">
              <div
                className="inline-block p-4"
                style={{ backgroundColor: resolveColor(adminData?.titleBgColor, '#1a1a1a') }}
              >
                <h2 className="text-3xl font-bold text-white">
                  {(locale === 'en' && adminData?.sectionTitle) || t('about.mission.title')}
                </h2>
              </div>
              <p className="mb-8 mt-6 max-w-3xl text-lg leading-relaxed text-gray-700">
                {(locale === 'en' && adminData?.content) || t('about.mission.description')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href={`/${locale}/${(adminData?.button1Url || 'Volunteer').replace(/^\//, '')}`}>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-none px-8 py-3 font-semibold text-white transition-none"
                    style={{ backgroundColor: resolveColor(adminData?.button1Color, '#6B5B95') }}
                  >
                    {(locale === 'en' && adminData?.button1Text) || t('about.mission.join')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </Link>
                <Link href={`/${locale}/${(adminData?.button2Url || 'ProgramPage/legal').replace(/^\//, '')}`}>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-none px-8 py-3 font-semibold text-white transition-none"
                    style={{ backgroundColor: resolveColor(adminData?.button2Color, '#E07A7A') }}
                  >
                    {(locale === 'en' && adminData?.button2Text) || t('about.mission.explore')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="slideRight">
              <img
                src={adminData?.imageUrl || '/images/teams.jpeg'}
                alt="Our Mission"
                className="h-96 w-full object-cover shadow-2xl"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section id="values" className="bg-white py-20 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="slideUp" className="mb-12">
            <div className="inline-block bg-wrf-purple p-4">
              <h2 className="text-3xl font-bold text-white">{t('about.values.title')}</h2>
            </div>
            <p className="mt-6 max-w-4xl text-lg leading-relaxed text-gray-700">
              {t('about.values.description')}
            </p>
          </ScrollReveal>
          <div className="grid gap-1 md:grid-cols-2">
            {(Array.isArray(adminData?.coreValues) && adminData.coreValues.length > 0
              ? adminData.coreValues
              : DEFAULT_CORE_VALUES
            ).map((val: { id: string; title: string; description: string; color: string }) => (
              <ScrollReveal key={val.id} variant="slideUpSm">
                <div
                  className="overflow-hidden shadow-inner"
                  style={{ backgroundColor: resolveColor(val.color, '#1a1a1a') }}
                >
                  <button
                    type="button"
                    onClick={() => toggleValue(val.id)}
                    className="w-full p-6 text-left text-white transition-none"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{val.title}</h3>
                      {val.description && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`h-6 w-6 transition-transform duration-300 ${openValue === val.id ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </div>
                  </button>
                  {val.description && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openValue === val.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="px-6 pb-6 text-white/90 leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of Operations */}
      <section id="operations" className="bg-gray-50 py-20 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="slideUp" className="mb-12">
            <div
              className="inline-block p-4"
              style={{ backgroundColor: resolveColor(adminData?.operationsTitleBgColor, '#E07A7A') }}
            >
              <h2 className="text-3xl font-bold text-white">
                {(locale === 'en' && adminData?.operationsTitle) || 'Areas of Operations'}
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-1 md:grid-cols-2">
            {[
              { key: 'ops1', title: (locale === 'en' && adminData?.opsArea1Title) || 'Peace Building and Social Cohesion', desc: (locale === 'en' && adminData?.opsArea1Desc) || '', bg: 'bg-wrf-black' },
              { key: 'ops2', title: (locale === 'en' && adminData?.opsArea2Title) || 'Legal Empowerment and International Accountability', desc: (locale === 'en' && adminData?.opsArea2Desc) || '', bg: 'bg-wrf-purple' },
              { key: 'ops3', title: (locale === 'en' && adminData?.opsArea3Title) || 'Digital Transformation and Open Gender Data', desc: (locale === 'en' && adminData?.opsArea3Desc) || '', bg: 'bg-wrf-coral' },
              { key: 'ops4', title: (locale === 'en' && adminData?.opsArea4Title) || 'Representation and Advocacy', desc: (locale === 'en' && adminData?.opsArea4Desc) || '', bg: 'bg-wrf-footer-mauve' },
            ].map((item) => (
              <ScrollReveal key={item.key} variant="slideUpSm">
                <div className={`overflow-hidden shadow-inner ${item.bg}`}>
                  <button
                    type="button"
                    onClick={() => toggleValue(item.key)}
                    className="w-full p-6 text-left text-white transition-none"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      {item.desc && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`h-6 w-6 transition-transform duration-300 ${openValue === item.key ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </div>
                  </button>
                  {item.desc && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openValue === item.key ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="px-6 pb-6 text-white/90 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="bg-wrf-black py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="slideUpLg">
            <div className="relative bg-white/10 p-8 md:p-12">
              <blockquote className="mb-6 text-xl italic leading-relaxed text-white md:text-2xl">
                &ldquo;{t('about.quote')}&rdquo;
              </blockquote>
              <div className="h-1 w-24 bg-wrf-coral" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Journey */}
      <section id="history" className="bg-white py-20 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 inline-block bg-wrf-footer-mauve p-4">
            <h2 className="text-3xl font-bold text-white">{t('about.journey.title')}</h2>
          </div>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-gray-700">
            {t('about.journey.description')}
          </p>
          <div className="relative mt-12">
            <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-gray-200 md:block" aria-hidden />
            <div className="space-y-12">
              {TIMELINE.map((item) => (
                <ScrollReveal key={item.year} variant="slideUpLg" className="relative md:pl-16">
                  <div className="absolute left-4 top-1 hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-wrf-coral md:flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" x2="4" y1="22" y2="15" />
                    </svg>
                  </div>
                  <div className="bg-gray-100 p-6 shadow-lg">
                    <p className="text-2xl font-bold text-wrf-purple">{item.year}</p>
                    <h3 className="my-2 text-xl font-semibold text-wrf-black">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact in Numbers */}
      <section id="impact" className="bg-gray-50 py-20 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 inline-block bg-wrf-coral p-4">
            <h2 className="text-3xl font-bold text-white">{t('about.impact.title')}</h2>
          </div>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-gray-700">
            {t('about.impact.description')}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '12,000+', label: t('about.impact.women'), bg: 'bg-wrf-black' },
              { value: '45', label: t('about.impact.countries'), bg: 'bg-wrf-purple' },
              { value: '150+', label: t('about.impact.partners'), bg: 'bg-wrf-coral' },
              { value: '$2.1M', label: t('about.impact.funds'), bg: 'bg-wrf-footer-mauve' },
            ].map((stat) => (
              <ScrollReveal key={stat.label} variant="slideUpLg">
                <div className={`p-8 text-center text-white shadow-lg ${stat.bg}`}>
                  <p className="text-5xl font-bold text-wrf-coral">{stat.value}</p>
                  <p className="mt-2">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our People */}
      <section id="team" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <ScrollReveal variant="slideLeft" className="text-left">
              <div className="mb-6 inline-block bg-wrf-purple p-4">
                <h2 className="text-3xl font-bold text-white">{t('about.people.title')}</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                {t('about.people.description')}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                {t('about.people.together')}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="slideRight" className="space-y-8">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {TEAM.map((person) => (
                  <div key={person.name} className={`relative h-48 overflow-hidden ${person.bg}`}>
                    <img src={person.img} alt={person.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" aria-hidden />
                    <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                      <h3 className="inline-block text-sm font-bold">
                        <span className="bg-wrf-purple px-1 py-0.5">{person.name}</span>
                      </h3>
                      <p className="mt-1 inline-block text-xs">
                        <span className="bg-wrf-coral px-1 py-0.5">{person.role}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <Link href="/Founders">
                  <button type="button" className="inline-flex items-center rounded-none bg-wrf-black px-8 py-3 font-semibold text-white transition-none">
                    {t('about.people.founders')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5">
                      <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
                      <path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" />
                      <path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" />
                    </svg>
                  </button>
                </Link>
                <Link href="/Team">
                  <button type="button" className="inline-flex items-center rounded-none bg-wrf-black px-8 py-3 font-semibold text-white transition-none">
                    {t('about.people.team')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section id="links" className="bg-gray-50 py-20 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="slideUp" className="mb-8">
            <div className="inline-block bg-wrf-coral p-4">
              <h2 className="text-3xl font-bold text-white">{t('about.getInvolved.title')}</h2>
            </div>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GET_INVOLVED_LINKS.map((link) => (
              <ScrollReveal key={link.href} variant="slideUpSm">
                <Link
                  href={link.href}
                  className={`flex h-full flex-col justify-between p-8 text-white shadow-inner transition-none ${link.bgClass}`}
                >
                  <h3 className="mb-2 text-lg font-bold">{link.label}</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-4 h-6 w-6 self-end">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
