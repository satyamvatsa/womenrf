'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/TranslationContext';

type EventItem = {
  id: string;
  slug: string;
  title: string;
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

const TABS = ['upcoming', 'today', 'week'] as const;
type Tab = (typeof TABS)[number];

function getWeekRange(refDate: Date): { start: Date; end: Date } {
  const day = refDate.getDay();
  const start = new Date(refDate);
  start.setDate(refDate.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

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
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [weekOffset, setWeekOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/data/events', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.events?.length) setEvents(d.events);
      })
      .catch(() => {});
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weekRef = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const { start: weekStart, end: weekEnd } = useMemo(() => getWeekRange(weekRef), [weekRef]);

  const filtered = useMemo(() => {
    let list = events;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          (e.department || '').toLowerCase().includes(q)
      );
    }

    if (activeTab === 'upcoming') {
      return list.filter((e) => new Date(e.date) >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    if (activeTab === 'today') {
      return list.filter((e) => isSameDay(new Date(e.date), today));
    }
    return list
      .filter((e) => {
        const d = new Date(e.date);
        return d >= weekStart && d <= weekEnd;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, activeTab, today, weekStart, weekEnd, searchQuery]);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const weekLabel = useMemo(() => {
    const sm = weekStart.toLocaleString('en', { month: 'long' });
    return `${sm} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
  }, [weekStart, weekEnd]);

  const tabLabels: Record<Tab, string> = {
    upcoming: t('events.tab.upcoming'),
    today: t('events.tab.today'),
    week: t('events.tab.week'),
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <p className="mb-6 text-xs font-medium uppercase tracking-wider text-gray-500">
          <Link href="/" className="hover:underline">{t('events.breadcrumb.home')}</Link>
          {' / '}
          <span>{t('events.breadcrumb.events')}</span>
        </p>

        {/* ── TABS ── */}
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'border-b-[3px] border-amber-600 text-gray-900'
                  : 'border-b-[3px] border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* ── SEARCH / FILTER BAR ── */}
        {activeTab === 'upcoming' && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        )}

        {/* ── UPCOMING / TODAY GRID ── */}
        {activeTab !== 'week' && (
          <div className="mt-8">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  {activeTab === 'today' ? t('events.empty.today') : t('events.empty.upcoming')}
                </h3>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── WEEK VIEW ── */}
        {activeTab === 'week' && (
          <div className="mt-8">
            <div className="mb-8 flex items-center justify-center gap-6">
              <button
                onClick={() => setWeekOffset((o) => o - 1)}
                className="text-xl text-amber-600 hover:text-amber-700"
              >
                &larr;
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{weekLabel}</h2>
              <button
                onClick={() => setWeekOffset((o) => o + 1)}
                className="text-xl text-amber-600 hover:text-amber-700"
              >
                &rarr;
              </button>
            </div>

            <div className="grid grid-cols-7 divide-x divide-gray-200 border border-gray-200">
              {weekDays.map((d) => {
                const dayName = d.toLocaleString('en', { weekday: 'short' }).toUpperCase();
                const monthLabel = d.toLocaleString('en', { month: 'short' });
                const dayEvents = filtered.filter((e) => isSameDay(new Date(e.date), d));
                const isToday = isSameDay(d, today);

                return (
                  <div key={d.toISOString()} className="min-h-[180px] p-2">
                    <p className={`text-xs font-bold uppercase ${isToday ? 'text-amber-600' : 'text-gray-500'}`}>
                      {dayName}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? 'text-amber-600' : 'text-gray-900'}`}>
                      {monthLabel} {d.getDate()}
                    </p>

                    <div className="mt-3 space-y-2">
                      {dayEvents.map((ev) => (
                        <Link
                          key={ev.id}
                          href={`/Events/${ev.slug}`}
                          className="block border border-gray-200 bg-gray-50 p-2 text-left hover:bg-gray-100"
                        >
                          <p className="text-[10px] font-bold uppercase text-gray-500">{ev.location}</p>
                          <p className="text-[10px] text-gray-500">{ev.time}</p>
                          <p className="mt-1 text-xs font-semibold leading-tight text-gray-900">{ev.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
