'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/TranslationContext';

const HERO_BG = '/images/hr-manager-teamwork-hr-department-hr-process-vector.jpg';

export default function VacanciesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    fetch('/api/data/vacancies', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
  }, []);

  const openVacancies = adminData && adminData.vacancies?.length > 0
    ? adminData.vacancies.filter((v: any) => v.status === 'open')
    : [];

  const filteredVacancies = openVacancies.filter((v: any) => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (!v.title?.toLowerCase().includes(q) && !v.description?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic can be wired later
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="absolute right-0 top-0 hidden h-full w-2/5 bg-cover bg-center md:block" style={{ clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)', backgroundImage: `url(${HERO_BG})` }} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div className="inline-block bg-wrf-black px-8 py-6">
            <h1 className="mb-4 text-4xl font-bold text-white lg:text-6xl">
              {t('vacancies.hero.title')}
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-white">
              {t('vacancies.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Search & filter bar */}
      <section className="border-b bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-4 md:grid-cols-5">
            <form onSubmit={handleSearch} className="flex md:col-span-3">
              <div className="relative flex-grow">
                <input
                  type="text"
                  id="search-query"
                  placeholder={t('vacancies.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 w-full rounded-l-md border border-r-0 border-gray-300 bg-white pl-12 pr-10 focus:border-wrf-black focus:outline-none focus:ring-2 focus:ring-wrf-black/20 focus:ring-offset-0"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-r-md bg-wrf-black px-8 font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {t('vacancies.search.button')}
              </button>
            </form>
            <div className="md:col-span-2">
              <button
                type="button"
                role="combobox"
                aria-expanded={categoryOpen}
                aria-haspopup="listbox"
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex h-14 w-full items-center justify-between rounded-none border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-wrf-black"
              >
                <span className="mr-2 text-gray-500">{t('vacancies.filter.category')}</span>
                <span className="flex-1 text-left">{t('vacancies.filter.all')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 opacity-50" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vacancies list / empty state */}
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredVacancies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVacancies.map((v: any) => (
                <div key={v.id} className="flex flex-col bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {v.type && (
                      <span className="bg-wrf-purple px-3 py-1 text-xs font-semibold text-white">
                        {v.type}
                      </span>
                    )}
                    {v.category && (
                      <span className="bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {v.category}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-wrf-black">{v.title}</h3>
                  {v.description && (
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{v.description}</p>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
                    {v.location && (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {v.location}
                      </span>
                    )}
                    {v.deadline && (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                        {new Date(v.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
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
                className="mx-auto mb-4 h-16 w-16 text-gray-300"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
              <h2 className="text-xl font-semibold text-wrf-black">{t('vacancies.empty.title')}</h2>
              <p className="mt-2 text-gray-500">{t('vacancies.empty.description')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
