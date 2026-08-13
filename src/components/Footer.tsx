'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

function getLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && ['en', 'fa', 'ps'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '/en';
}

export default function Footer() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const currentLocale = localePrefix.replace('/', '');
  const [subscribed, setSubscribed] = useState(false);
  const adminData = useCmsData<Record<string, any>>('footer');
  const { t } = useTranslation();

  const defaultLinkColumns = [
    {
      title: t('footer.sections.wrfInfo'),
      className: 'bg-wrf-purple',
      links: [
        { label: t('footer.sections.wrfInfo.ourTeam'), href: '/our_team' },
        { label: t('footer.sections.wrfInfo.boardOfDirectors'), href: '/board_of_Directors' },
        { label: t('footer.sections.wrfInfo.about'), href: '/About' },
        { label: t('footer.sections.wrfInfo.faq'), href: '/FAQ' },
        { label: t('footer.sections.wrfInfo.news'), href: '/News' },
        { label: t('footer.sections.wrfInfo.vacancies'), href: '/Vacancies' },
      ],
    },
    {
      title: t('footer.sections.whatWeDo'),
      className: 'bg-wrf-coral',
      links: [
        { label: t('footer.sections.whatWeDo.allPrograms') || 'Our Impact Programs', href: '/OurImpactPrograms' },
        { label: t('footer.sections.whatWeDo.legal'), href: '/ProgramPage?slug=legal-empowerment-international-accountability' },
        { label: t('footer.sections.whatWeDo.peace'), href: '/ProgramPage?slug=peacebuilding-social-cohesion' },
        { label: t('footer.sections.whatWeDo.digital'), href: '/ProgramPage?slug=Digital-Transformation-and%20-Open%20-Gender%20-Data' },
        { label: t('footer.sections.whatWeDo.advocacy'), href: '/ProgramPage?slug=representation-advocacy' },
      ],
    },
    {
      title: t('footer.sections.getInvolved'),
      className: 'bg-wrf-footer-mauve',
      links: [
        { label: t('footer.sections.getInvolved.volunteer'), href: '/Volunteer' },
        ...(currentLocale === 'en' ? [{ label: t('footer.sections.getInvolved.donate'), href: '/Donate' }] : []),
        { label: t('footer.sections.getInvolved.partnership'), href: '/Partnership' },
        { label: t('footer.sections.getInvolved.contact'), href: '/Contact' },
      ],
    },
  ];

  const BG_MAP: Record<string, string> = {
    secondary: 'bg-wrf-purple',
    accent: 'bg-wrf-coral',
    support: 'bg-wrf-footer-mauve',
  };

  const URL_FIXES: Record<string, string> = {
    '/Founders': '/our_team',
    '/Team': '/board_of_Directors',
  };

  const LABEL_FIXES: Record<string, string> = {
    'Our team': 'Our Team',
  };

  const fixUrl = (url: string): string => URL_FIXES[url] || url;
  const fixLabel = (label: string): string => LABEL_FIXES[label] || label;

  const linkColumns = adminData?.linkColumns
    ? adminData.linkColumns.map((col: any, idx: number) => ({
        title: col.title,
        className: col.className || BG_MAP[col.backgroundColor] || ['bg-wrf-purple', 'bg-wrf-coral', 'bg-wrf-footer-mauve'][idx] || 'bg-wrf-purple',
        links: (col.links || []).map((l: any) => ({
          label: fixLabel(l.label || l.text || ''),
          href: fixUrl(l.href || (l.url ? `/${l.url}` : '/')),
        })),
      }))
    : defaultLinkColumns;

  const getSocialUrl = (platform: string, fallback: string) => {
    if (adminData?.socialLinks) {
      const link = adminData.socialLinks.find((s: any) => s.platform === platform);
      if (link?.url) return link.url;
    }
    return fallback;
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput?.value) {
      try {
        const res = await fetch('/api/submit/newsletter-subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput.value }),
        });
        if (res.ok) {
          setSubscribed(true);
          emailInput.value = '';
          setTimeout(() => setSubscribed(false), 5000);
        }
      } catch {}
    }
  };

  return (
    <footer id="footer" className="bg-wrf-black text-white">
      {/* Section 1: Contact + Social */}
      <div className="border-b border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold">{adminData?.newsletterTitle || t('footer.contact.title')}</h3>
              <p className="mb-6 text-gray-400">
                {adminData?.newsletterSubtitle || t('footer.contact.description')}
              </p>
              <form onSubmit={handleSubscribe} className="mb-4 flex gap-3">
                <input
                  type="email"
                  placeholder={adminData?.newsletterPlaceholder || t('footer.contact.emailPlaceholder')}
                  required
                  aria-label="Email"
                  disabled={subscribed}
                  className="h-10 flex-1 rounded-none border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-0 disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-none bg-wrf-coral px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-wrf-coral-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                    <path d="m21.854 2.147-10.94 10.939" />
                  </svg>
                  {subscribed ? t('footer.contact.subscribed') : t('footer.contact.subscribe')}
                </button>
              </form>
              {subscribed && (
                <p className="text-sm font-medium text-green-400" role="status">
                  {t('footer.contact.successMessage')}
                </p>
              )}
            </div>
            <div className="text-left md:text-right">
              <h3 className="mb-4 text-2xl font-bold">{adminData?.socialTitle || t('footer.social.title')}</h3>
              <p className="mb-6 text-gray-400">{t('footer.social.description')}</p>
              <div className="flex justify-start gap-4 md:justify-end">
                <a href={getSocialUrl('facebook', '#')} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-wrf-coral" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href={getSocialUrl('x', 'https://x.com/women_s24642')} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-wrf-coral" aria-label="X (Twitter)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href={getSocialUrl('instagram', 'https://www.instagram.com/womensrightsfirst/')} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-wrf-coral" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href={getSocialUrl('linkedin', 'https://www.linkedin.com/in/women%E2%80%99s-rights-first-wrf-870226381/')} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-wrf-coral" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Four columns - WRF & Info, What we do, Get Involved, Where we are */}
      <div className="border-b border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="order-1 grid grid-cols-1 gap-8 md:col-span-3 md:grid-cols-3">
              {linkColumns.map((col: any, idx: number) => (
                <div key={col.title || idx} className={`${col.className || ['bg-wrf-purple', 'bg-wrf-coral', 'bg-wrf-footer-mauve'][idx] || 'bg-wrf-purple'} p-6`}>
                  <h4 className="mb-4 text-lg font-semibold text-white">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map(({ label, href }: { label: string; href: string }) => (
                      <li key={label}>
                        <Link href={`${localePrefix}${href}`} className="font-normal text-white transition-colors hover:text-white/80">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="order-2 bg-white/5 p-6 md:order-2">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {adminData?.addressTitle || t('footer.location.title')}
              </h4>
              <div className="mb-6 whitespace-pre-line text-gray-400">{adminData?.addressContent || ''}</div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-none border border-white/30 bg-transparent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {t('footer.location.callUs')}
                </button>
                <Link
                  href={adminData?.whatsappNumber ? `https://wa.me/${adminData.whatsappNumber}` : 'https://wa.me/1234567890'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-none bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                  {t('footer.location.whatsapp')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Copyright + links */}
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
              <p className="text-center text-sm text-gray-400 md:text-left">
                {adminData?.copyrightText || t('footer.copyright')}
              </p>
              <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                <Link href={adminData?.privacyPolicyUrl || `${localePrefix}/PrivacyPolicy`} className="text-sm text-gray-400 transition-colors hover:text-white">
                  {t('footer.privacyPolicy')}
                </Link>
                <Link href={adminData?.termsOfServiceUrl || '#'} className="text-sm text-gray-400 transition-colors hover:text-white">
                  {t('footer.termsOfService')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
