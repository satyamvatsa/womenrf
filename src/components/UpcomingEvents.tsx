'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

type EventItem = {
  id: string;
  slug: string;
  title: string;
  status?: 'draft' | 'published';
  date: string;
  endDate?: string;
  time?: string;
  location?: string;
  image?: string;
};

const MAX_EVENTS = 3;

function getLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && ['en', 'fa', 'ps'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '/en';
}

export default function UpcomingEvents() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const { t } = useTranslation();

  const adminData = useCmsData<Record<string, any>>('homepage');
  const eventsData = useCmsData<Record<string, any>>('events');

  const showEvents = adminData?.showEvents !== undefined ? adminData.showEvents : true;
  const title = adminData?.eventsTitle || t('upcomingEvents.title');
  const subtitle = adminData?.eventsSubtitle || t('upcomingEvents.subtitle');
  const titleBg = adminData?.eventsTitleBg || 'bg-secondary';
  const buttonColor = adminData?.eventsButtonColor || 'bg-secondary';

  const BG_MAP: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  const titleBgClass = BG_MAP[titleBg] || 'bg-wrf-purple';
  const btnBgClass = BG_MAP[buttonColor] || 'bg-wrf-purple';

  const upcoming = useMemo(() => {
    const all: EventItem[] = eventsData?.events ?? [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return all
      .filter((e) => e.status !== 'draft')
      // An event runs until its end date, so a multi-day event stays "upcoming" while in progress.
      .filter((e) => {
        const until = new Date(e.endDate || e.date);
        return !Number.isNaN(until.getTime()) && until >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, MAX_EVENTS);
  }, [eventsData]);

  // The whole section stays out of the page unless there is something to announce.
  if (!showEvents || upcoming.length === 0) return null;

  return (
    <section id="upcoming-events" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <div className={`mb-4 inline-block ${titleBgClass} px-8 py-6`}>
            <h2 className="text-4xl font-bold text-white">{title}</h2>
          </div>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((ev) => {
            const d = new Date(ev.date);
            const day = d.getDate();
            const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();

            return (
              <Link
                key={ev.id || ev.slug}
                href={`${localePrefix}/Events/${ev.slug}`}
                className="group flex flex-col overflow-hidden bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                {ev.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex flex-grow flex-col p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-center">
                      <p className="font-serif text-4xl font-light italic leading-none text-amber-600">{day}</p>
                      <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-amber-600">{month}</p>
                    </div>
                    <div className="flex-1 pt-0.5">
                      {ev.location && (
                        <p className="text-xs font-bold uppercase leading-tight tracking-wide text-gray-800">{ev.location}</p>
                      )}
                      {ev.time && <p className="mt-1 text-xs text-gray-500">{ev.time}</p>}
                    </div>
                  </div>
                  <hr className="my-4 border-gray-200" />
                  <h3 className="text-lg font-bold leading-snug text-wrf-black group-hover:text-wrf-purple">
                    {ev.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-left">
          <Link
            href={`${localePrefix}/Events`}
            className={`inline-flex items-center gap-2 ${btnBgClass} px-8 py-3 font-semibold text-white transition-colors hover:opacity-90`}
          >
            {t('upcomingEvents.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
