'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

type EventItem = {
  id: string;
  slug: string;
  title: string;
  status?: 'draft' | 'published';
  date: string;
  endDate?: string;
  time: string;
  location: string;
  description?: string;
  image?: string;
  topics?: string[];
  department?: string;
  registrationLink?: string;
};

function EventCard({ ev }: { ev: EventItem }) {
  const d = new Date(ev.date);
  const day = d.getDate();
  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();

  return (
    <Link
      href={`/Events/${ev.slug}`}
      className="group block border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="p-5">
        {/* Top: Date | Location + Time */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-center">
            <p className="font-serif text-4xl font-light italic leading-none text-amber-600">{day}</p>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-amber-600">{month}</p>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-xs font-bold uppercase leading-tight tracking-wide text-gray-800">{ev.location}</p>
            <p className="mt-1 text-xs text-gray-500">{ev.time}</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-200" />

        {/* Title */}
        <h3 className="font-serif text-xl font-semibold leading-snug text-gray-900 group-hover:text-amber-700">
          {ev.title}
        </h3>
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const { t } = useTranslation();
  const eventsData = useCmsData<Record<string, any>>('events');
  const allEvents: EventItem[] = eventsData?.events ?? [];
  const [searchQuery, setSearchQuery] = useState('');

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const events = useMemo(() => {
    // Drafts stay out of the public site. Events saved before `status` existed are treated as published.
    let list = allEvents.filter((e) => e.status !== 'draft');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          (e.department || '').toLowerCase().includes(q)
      );
    }

    // One list, ordered the way a visitor reads it: what is coming up (soonest
    // first), then what already happened (most recent first).
    const time = (e: EventItem) => new Date(e.date).getTime();
    const isUpcoming = (e: EventItem) => new Date(e.endDate || e.date) >= today;

    const upcoming = list.filter(isUpcoming).sort((a, b) => time(a) - time(b));
    const past = list.filter((e) => !isUpcoming(e)).sort((a, b) => time(b) - time(a));

    return [...upcoming, ...past];
  }, [allEvents, searchQuery, today]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <p className="mb-6 text-xs font-medium uppercase tracking-wider text-gray-500">
          <Link href="/" className="hover:underline">{t('events.breadcrumb.home')}</Link>
          {' / '}
          <span>{t('events.breadcrumb.events')}</span>
        </p>

        {/* ── SEARCH BAR ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder={t('events.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-300 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-amber-600 focus:outline-none"
          />
          <button
            onClick={() => {}}
            className="bg-gray-900 px-8 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
          >
            {t('events.search.button')}
          </button>
        </div>

        {/* ── EVENTS GRID ── */}
        <div className="mt-8">
          {events.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                {t('events.empty')}
              </h3>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((ev) => (
                <EventCard key={ev.id || ev.slug} ev={ev} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
