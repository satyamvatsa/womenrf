'use client';

import { useState, useMemo, useRef } from 'react';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

export default function VacanciesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyVacancy, setApplyVacancy] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', coverLetter: '', resumeUrl: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adminData = useCmsData<Record<string, any> | any[]>('vacancies');

  const vacanciesList = Array.isArray(adminData)
    ? adminData
    : (adminData && Array.isArray((adminData as Record<string, any>).vacancies)
      ? (adminData as Record<string, any>).vacancies
      : []);
  const openVacancies = vacanciesList.filter((v: any) => v.status === 'open');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    openVacancies.forEach((v: any) => { if (v.category) cats.add(v.category); });
    return Array.from(cats);
  }, [openVacancies]);

  const types = useMemo(() => {
    const ts = new Set<string>();
    openVacancies.forEach((v: any) => { if (v.type) ts.add(v.type); });
    return Array.from(ts);
  }, [openVacancies]);

  const filteredVacancies = openVacancies.filter((v: any) => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (!v.title?.toLowerCase().includes(q) && !v.description?.toLowerCase().includes(q)) return false;
    }
    if (activeCategory !== 'all' && v.category !== activeCategory) return false;
    if (activeType !== 'all' && v.type !== activeType) return false;
    return true;
  });

  const openApply = (v: any) => {
    setApplyVacancy(v);
    setSubmitSuccess(false);
    setResumeFile(null);
    setForm({ fullName: '', email: '', phone: '', coverLetter: '', resumeUrl: '' });
  };

  const closeApply = () => {
    setApplyVacancy(null);
    setSubmitting(false);
    setSubmitSuccess(false);
    setResumeFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      alert('Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }
    setResumeFile(file);
    setForm(f => ({ ...f, resumeUrl: '' }));
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyVacancy) return;
    setSubmitting(true);
    try {
      let finalResumeUrl = form.resumeUrl.trim() || undefined;

      if (resumeFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', resumeFile);
        const uploadRes = await fetch('/api/upload-resume', { method: 'POST', body: fd });
        const uploadData = await uploadRes.json();
        setUploading(false);
        if (!uploadRes.ok) {
          alert(uploadData?.error || 'Resume upload failed. Please try again.');
          setSubmitting(false);
          return;
        }
        finalResumeUrl = uploadData.url;
      }

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
          resumeUrl: finalResumeUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setTimeout(() => closeApply(), 4000);
      } else {
        alert(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const truncate = (text: string, maxLen = 180) => {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen).trimEnd() + '…';
  };

  const TYPE_COLORS: Record<string, string> = {
    'full-time': 'bg-wrf-purple text-white',
    'part-time': 'bg-wrf-coral text-white',
    'contract': 'bg-amber-500 text-white',
    'internship': 'bg-teal-500 text-white',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wrf-purple via-wrf-purple-dark to-wrf-black py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-wrf-coral blur-3xl" />
          <div className="absolute -bottom-10 right-10 h-56 w-56 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white lg:text-5xl">
              {t('vacancies.hero.title')}
            </h1>
            <p className="text-lg leading-relaxed text-white/80">
              {t('vacancies.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="relative z-10 -mt-8 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5">
            {/* Search bar */}
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder={t('vacancies.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm transition-colors focus:border-wrf-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-wrf-purple/20"
              />
            </div>

            {/* Filter chips */}
            {(categories.length > 0 || types.length > 0) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {types.length > 0 && (
                  <>
                    <span className="mr-1 text-xs font-medium uppercase tracking-wider text-gray-400">{t('vacancies.filter.type') || 'Type'}:</span>
                    <button
                      onClick={() => setActiveType('all')}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${activeType === 'all' ? 'bg-wrf-purple text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {t('vacancies.filter.all')}
                    </button>
                    {types.map((tp) => (
                      <button
                        key={tp}
                        onClick={() => setActiveType(tp)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all ${activeType === tp ? 'bg-wrf-purple text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {tp}
                      </button>
                    ))}
                  </>
                )}

                {categories.length > 0 && (
                  <>
                    {types.length > 0 && <span className="mx-2 h-5 w-px bg-gray-200" />}
                    <span className="mr-1 text-xs font-medium uppercase tracking-wider text-gray-400">{t('vacancies.filter.category')}:</span>
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${activeCategory === 'all' ? 'bg-wrf-coral text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {t('vacancies.filter.all')}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${activeCategory === cat ? 'bg-wrf-coral text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results count + listing */}
      <section className="pb-16 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {t('vacancies.showing') || 'Showing'}{' '}
              <span className="font-semibold text-wrf-black">{filteredVacancies.length}</span>{' '}
              {t('vacancies.results') || (filteredVacancies.length === 1 ? 'position' : 'open positions')}
            </p>
          </div>

          {filteredVacancies.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredVacancies.map((v: any) => {
                const isExpanded = expandedId === v.id;
                return (
                  <div
                    key={v.id}
                    className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-lg hover:ring-wrf-purple/20 ${isExpanded ? 'md:col-span-2 lg:col-span-3' : ''}`}
                  >
                    {/* Card header */}
                    <div className="flex items-start gap-4 p-5 pb-3">
                      {/* Icon */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wrf-purple/10 to-wrf-coral/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-wrf-purple">
                          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        {v.category && (
                          <p className="mb-0.5 text-xs font-medium text-wrf-purple">{v.category}</p>
                        )}
                        <h3 className="text-base font-bold leading-snug text-wrf-black group-hover:text-wrf-purple transition-colors">
                          {v.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1 px-5">
                      {v.description && (
                        <div className="text-sm leading-relaxed text-gray-500">
                          {isExpanded ? (
                            <div className="space-y-2">
                              {v.description.split('\n').map((para: string, i: number) => (
                                para.trim() ? <p key={i}>{para}</p> : null
                              ))}
                            </div>
                          ) : (
                            <p>{truncate(v.description)}</p>
                          )}
                        </div>
                      )}

                      {/* Requirements (expanded only) */}
                      {isExpanded && v.requirements && (
                        <div className="mt-4">
                          <h4 className="mb-2 text-sm font-semibold text-wrf-black">{t('vacancies.requirements') || 'Requirements'}</h4>
                          <div className="space-y-1.5 text-sm leading-relaxed text-gray-500">
                            {v.requirements.split('\n').map((para: string, i: number) => (
                              para.trim() ? <p key={i}>{para}</p> : null
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Read more / less toggle */}
                      {v.description && v.description.length > 180 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : v.id)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-wrf-purple hover:text-wrf-purple-dark transition-colors"
                        >
                          {isExpanded ? (t('vacancies.readLess') || 'Read Less') : (t('vacancies.readMore') || 'Read More')}
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Card footer */}
                    <div className="mt-4 border-t border-gray-100 px-5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {v.type && (
                            <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${TYPE_COLORS[v.type] || 'bg-gray-200 text-gray-700'}`}>
                              {v.type}
                            </span>
                          )}
                          {v.location && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                              {v.location}
                            </span>
                          )}
                          {v.deadline && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                              {new Date(v.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openApply(v)}
                          className="rounded-xl bg-wrf-purple px-5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-wrf-purple-dark hover:shadow-md active:scale-[0.97]"
                        >
                          {t('vacancies.apply.button')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-black/5">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-wrf-black">{t('vacancies.empty.title')}</h2>
              <p className="mt-1 text-sm text-gray-500">{t('vacancies.empty.description')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Apply modal */}
      {applyVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={closeApply} role="dialog" aria-modal="true" aria-labelledby="apply-modal-title">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/10" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-wrf-purple to-wrf-purple-dark px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 id="apply-modal-title" className="text-lg font-bold text-white">
                    {t('vacancies.apply.title')}
                  </h2>
                  <p className="mt-0.5 text-sm text-white/70">{applyVacancy.title}</p>
                </div>
                <button onClick={closeApply} className="rounded-lg p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 p-6">
              {submitSuccess ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-wrf-black">{t('vacancies.apply.successTitle') || 'Application Submitted!'}</h3>
                  <p className="mb-1 text-sm text-gray-600">{t('vacancies.apply.success')}</p>
                  <p className="text-xs text-gray-400">{t('vacancies.apply.successEmail') || 'A confirmation email has been sent to your inbox.'}</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500">{t('vacancies.apply.subtitle')}</p>
                  <div>
                    <label htmlFor="apply-fullName" className="mb-1.5 block text-sm font-medium text-gray-700">{t('vacancies.apply.fullName')}</label>
                    <input id="apply-fullName" type="text" required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-wrf-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-wrf-purple/20" />
                  </div>
                  <div>
                    <label htmlFor="apply-email" className="mb-1.5 block text-sm font-medium text-gray-700">{t('vacancies.apply.email')}</label>
                    <input id="apply-email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-wrf-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-wrf-purple/20" />
                  </div>
                  <div>
                    <label htmlFor="apply-phone" className="mb-1.5 block text-sm font-medium text-gray-700">{t('vacancies.apply.phone')}</label>
                    <input id="apply-phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-wrf-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-wrf-purple/20" />
                  </div>
                  <div>
                    <label htmlFor="apply-coverLetter" className="mb-1.5 block text-sm font-medium text-gray-700">{t('vacancies.apply.coverLetter')}</label>
                    <textarea id="apply-coverLetter" rows={4} required value={form.coverLetter} onChange={e => setForm(f => ({ ...f, coverLetter: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-wrf-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-wrf-purple/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('vacancies.apply.resume') || 'Resume'}</label>
                    {/* File upload */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 transition-colors ${resumeFile ? 'border-wrf-purple/40 bg-wrf-purple/5' : 'border-gray-200 bg-gray-50 hover:border-wrf-purple/30 hover:bg-gray-100'}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${resumeFile ? 'bg-wrf-purple/10' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={resumeFile ? 'text-wrf-purple' : 'text-gray-500'}>
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        {resumeFile ? (
                          <>
                            <p className="truncate text-sm font-medium text-wrf-black">{resumeFile.name}</p>
                            <p className="text-xs text-gray-400">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-600">{t('vacancies.apply.uploadResume') || 'Click to upload your resume'}</p>
                            <p className="text-xs text-gray-400">{t('vacancies.apply.uploadFormats') || 'PDF, DOC, DOCX (max 10MB)'}</p>
                          </>
                        )}
                      </div>
                      {resumeFile && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    {/* OR divider */}
                    {!resumeFile && (
                      <>
                        <div className="my-3 flex items-center gap-3">
                          <div className="h-px flex-1 bg-gray-200" />
                          <span className="text-xs font-medium text-gray-400">{t('vacancies.apply.or') || 'OR'}</span>
                          <div className="h-px flex-1 bg-gray-200" />
                        </div>
                        <input
                          id="apply-resumeUrl"
                          type="url"
                          placeholder={t('vacancies.apply.resumeUrlPlaceholder') || 'Paste a link to your resume...'}
                          value={form.resumeUrl}
                          onChange={e => setForm(f => ({ ...f, resumeUrl: e.target.value }))}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-wrf-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-wrf-purple/20"
                        />
                      </>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={submitting}
                      className="flex-1 rounded-xl bg-wrf-purple px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-wrf-purple-dark hover:shadow-md disabled:opacity-60">
                      {submitting ? (uploading ? (t('vacancies.apply.uploading') || 'Uploading resume…') : t('vacancies.apply.submitting')) : t('vacancies.apply.submit')}
                    </button>
                    <button type="button" onClick={closeApply} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
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
