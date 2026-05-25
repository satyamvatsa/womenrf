'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

const HERO_BG = '/images/hr-manager-teamwork-hr-department-hr-process-vector.jpg';

export default function VacanciesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [applyVacancy, setApplyVacancy] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', coverLetter: '', resumeUrl: '' });

  const adminData = useCmsData<Record<string, any> | any[]>('vacancies');

  const vacanciesList = Array.isArray(adminData)
    ? adminData
    : (adminData && Array.isArray((adminData as Record<string, any>).vacancies)
      ? (adminData as Record<string, any>).vacancies
      : []);
  const openVacancies = vacanciesList.filter((v: any) => v.status === 'open');

  const filteredVacancies = openVacancies.filter((v: any) => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (!v.title?.toLowerCase().includes(q) && !v.description?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const openApply = (v: any) => {
    setApplyVacancy(v);
    setSubmitSuccess(false);
    setForm({ fullName: '', email: '', phone: '', coverLetter: '', resumeUrl: '' });
  };

  const closeApply = () => {
    setApplyVacancy(null);
    setSubmitting(false);
    setSubmitSuccess(false);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyVacancy) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          position: applyVacancy.title || applyVacancy.id,
          vacancyId: applyVacancy.id,
          coverLetter: form.coverLetter.trim(),
          resumeUrl: form.resumeUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setTimeout(() => closeApply(), 2000);
      } else {
        alert(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setSubmitting(false);
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
                    <div className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
                      {v.description.split('\n').map((para: string, i: number) => (
                        para.trim() ? (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>{para}</p>
                        ) : null
                      ))}
                    </div>
                  )}
                  {v.requirements && (
                    <div className="mb-4 text-sm leading-relaxed text-gray-600">
                      <h4 className="mb-1 font-semibold text-wrf-black">{t('vacancies.requirements') || 'Requirements'}</h4>
                      {v.requirements.split('\n').map((para: string, i: number) => (
                        para.trim() ? (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>{para}</p>
                        ) : null
                      ))}
                    </div>
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
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => openApply(v)}
                      className="w-full rounded-none bg-wrf-black px-4 py-3 font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-wrf-black focus:ring-offset-2"
                    >
                      {t('vacancies.apply.button')}
                    </button>
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

      {/* Apply modal */}
      {applyVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeApply} role="dialog" aria-modal="true" aria-labelledby="apply-modal-title">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-none border border-gray-200 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
              <h2 id="apply-modal-title" className="text-xl font-bold text-wrf-black">
                {t('vacancies.apply.title')} — {applyVacancy.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{t('vacancies.apply.subtitle')}</p>
            </div>
            <form onSubmit={handleApplySubmit} className="space-y-4 p-6">
              {submitSuccess ? (
                <p className="rounded border border-green-200 bg-green-50 p-4 text-green-800">{t('vacancies.apply.success')}</p>
              ) : (
                <>
                  <div>
                    <label htmlFor="apply-fullName" className="mb-1 block text-sm font-medium text-gray-700">{t('vacancies.apply.fullName')}</label>
                    <input id="apply-fullName" type="text" required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      className="w-full rounded-none border border-gray-300 px-3 py-2 focus:border-wrf-black focus:outline-none focus:ring-1 focus:ring-wrf-black" />
                  </div>
                  <div>
                    <label htmlFor="apply-email" className="mb-1 block text-sm font-medium text-gray-700">{t('vacancies.apply.email')}</label>
                    <input id="apply-email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-none border border-gray-300 px-3 py-2 focus:border-wrf-black focus:outline-none focus:ring-1 focus:ring-wrf-black" />
                  </div>
                  <div>
                    <label htmlFor="apply-phone" className="mb-1 block text-sm font-medium text-gray-700">{t('vacancies.apply.phone')}</label>
                    <input id="apply-phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full rounded-none border border-gray-300 px-3 py-2 focus:border-wrf-black focus:outline-none focus:ring-1 focus:ring-wrf-black" />
                  </div>
                  <div>
                    <label htmlFor="apply-coverLetter" className="mb-1 block text-sm font-medium text-gray-700">{t('vacancies.apply.coverLetter')}</label>
                    <textarea id="apply-coverLetter" rows={4} required value={form.coverLetter} onChange={e => setForm(f => ({ ...f, coverLetter: e.target.value }))}
                      className="w-full rounded-none border border-gray-300 px-3 py-2 focus:border-wrf-black focus:outline-none focus:ring-1 focus:ring-wrf-black" />
                  </div>
                  <div>
                    <label htmlFor="apply-resumeUrl" className="mb-1 block text-sm font-medium text-gray-700">{t('vacancies.apply.resumeUrl')}</label>
                    <input id="apply-resumeUrl" type="url" placeholder="https://..." value={form.resumeUrl} onChange={e => setForm(f => ({ ...f, resumeUrl: e.target.value }))}
                      className="w-full rounded-none border border-gray-300 px-3 py-2 focus:border-wrf-black focus:outline-none focus:ring-1 focus:ring-wrf-black" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={submitting}
                      className="flex-1 rounded-none bg-wrf-black px-4 py-3 font-semibold text-white hover:bg-black disabled:opacity-70">
                      {submitting ? t('vacancies.apply.submitting') : t('vacancies.apply.submit')}
                    </button>
                    <button type="button" onClick={closeApply} className="rounded-none border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                      {t('vacancies.apply.cancel')}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
