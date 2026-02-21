'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/TranslationContext';

const LOCALES = [
  { code: 'en', label: 'ENG' },
  { code: 'fa', label: 'فارسی/دری' },
  { code: 'ps', label: 'پښتو' },
] as const;
type LocaleCode = (typeof LOCALES)[number]['code'];

function ChevronDown({ open }: { open: boolean }) {
  return (
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
      className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const localeCodes = LOCALES.map((l) => l.code);
  if (segments.length > 0 && localeCodes.includes(segments[0] as LocaleCode)) {
    const rest = segments.slice(1);
    return rest.length ? `/${rest.join('/')}` : '/';
  }
  return pathname || '/';
}

function getLocaleFromPath(pathname: string): LocaleCode {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && (segments[0] === 'fa' || segments[0] === 'ps' || segments[0] === 'en')) {
    return segments[0] as LocaleCode;
  }
  return 'en';
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = getLocaleFromPath(pathname);
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const langDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const langDropdownMobileRef = useRef<HTMLDivElement>(null);
  const { t, localePrefix: tLocalePrefix } = useTranslation();

  const COLOR_MAP: Record<string, string> = {
    secondary: 'text-wrf-purple',
    accent: 'text-wrf-coral',
    support: 'text-wrf-footer-mauve',
    white: 'text-white',
  };

  const MENU_SECTIONS: { title: string; titleClass: string; links: { href: string; label: string }[] }[] = adminData?.megaColumns && currentLocale === 'en'
    ? adminData.megaColumns.map((col: any) => ({
        title: col.title,
        titleClass: col.titleClass || COLOR_MAP[col.color] || 'text-white',
        links: (col.links || []).map((l: any) => ({
          href: l.href || (l.path ? `/${l.path}` : '/'),
          label: l.label || l.name || '',
        })),
      }))
    : [
    {
      title: t('header.menuSection.wrf.title'),
      titleClass: 'text-wrf-purple',
      links: [
        { href: '/Founders', label: t('header.menuSection.wrf.founders') },
        { href: '/Team', label: t('header.menuSection.wrf.team') },
        { href: '/About', label: t('header.menuSection.wrf.about') },
      ],
    },
    {
      title: t('header.menuSection.whatWeDo.title'),
      titleClass: 'text-wrf-coral',
      links: [
        { href: '/ProgramPage?slug=legal-empowerment-international-accountability', label: t('header.menuSection.whatWeDo.legal') },
        { href: '/ProgramPage?slug=peacebuilding-social-cohesion', label: t('header.menuSection.whatWeDo.peace') },
        { href: '/ProgramPage?slug=Digital-Transformation-and%20-Open%20-Gender%20-Data', label: t('header.menuSection.whatWeDo.digital') },
        { href: '/ProgramPage?slug=representation-advocacy', label: t('header.menuSection.whatWeDo.advocacy') },
      ],
    },
    {
      title: t('header.menuSection.info.title'),
      titleClass: 'text-wrf-footer-mauve',
      links: [
        { href: '/FAQ', label: t('header.menuSection.info.faq') },
        { href: '/News', label: t('header.menuSection.info.news') },
        { href: '/Vacancies', label: t('header.menuSection.info.vacancies') },
        { href: '/PrivacyPolicy', label: t('header.menuSection.info.privacy') },
      ],
    },
    {
      title: t('header.menuSection.involved.title'),
      titleClass: 'text-white',
      links: [
        { href: '/Partnership', label: t('header.menuSection.involved.partner') },
        { href: '/Volunteer', label: t('header.menuSection.involved.volunteer') },
        { href: '/Contact', label: t('header.menuSection.involved.contact') },
      ],
    },
  ];

  const navLinks: { href: string; label: string }[] = adminData?.navLinks && currentLocale === 'en'
    ? adminData.navLinks.map((l: any) => ({
        href: l.href || (l.path ? `/${l.path}` : '/'),
        label: l.label || l.text || '',
      }))
    : [
    { href: '/About', label: t('header.nav.wrf') },
    { href: '/News', label: t('header.nav.news') },
    { href: '/Vacancies', label: t('header.nav.vacancies') },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const inDesktop = langDropdownDesktopRef.current?.contains(target);
      const inMobile = langDropdownMobileRef.current?.contains(target);
      if (!inDesktop && !inMobile) setLangDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('/api/data/header', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenAccordion(null);
  };

  const currentLocaleLabel = LOCALES.find((l) => l.code === currentLocale)?.label ?? 'ENG';
  const otherLocales = LOCALES.filter((l) => l.code !== currentLocale);
  const localePrefix = `/${currentLocale}`;

  return (
    <header className="relative z-50 overflow-visible bg-white shadow-sm">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-2 sm:h-24 sm:gap-4 lg:h-32">
          <div className="min-w-0 shrink">
            <Link href={localePrefix === '/en' ? '/en' : localePrefix} className="block">
              <Image
                src={adminData?.logoUrl || '/logo.jpg'}
                alt={t('header.logo.alt')}
                width={240}
                height={96}
                className="h-14 w-auto max-w-[160px] object-contain sm:h-20 sm:max-w-xs lg:h-24"
                priority
              />
            </Link>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 lg:flex lg:gap-6">
            <nav className="flex min-w-0 items-center gap-3 lg:gap-6" aria-label="Main navigation">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={`${localePrefix}${href}`}
                  className="text-sm font-bold uppercase tracking-wider text-wrf-black transition-colors hover:text-wrf-purple"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <form
              className="flex w-40 shrink-0 items-center lg:w-52"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                if (q) {
                  router.push(`${localePrefix}/News?q=${encodeURIComponent(q)}`);
                }
              }}
            >
              <div className="relative w-full min-w-0">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={(currentLocale === 'en' && adminData?.searchPlaceholder) || t('header.search.placeholder')}
                  aria-label={t('header.search.label')}
                  className="h-11 w-full rounded-none border border-black bg-white pl-4 pr-12 text-sm text-gray-900 placeholder:text-gray-500 focus:border-wrf-purple focus:outline-none focus:ring-2 focus:ring-wrf-purple/20 focus:ring-offset-0"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center bg-wrf-purple px-4 text-white transition-colors hover:bg-wrf-purple-dark"
                  aria-label={t('header.search.label')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </div>
            </form>

            {currentLocale === 'en' && (
              <Link
                href={`${localePrefix}/${adminData?.donationButtonLink || 'Donate'}`}
                className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-none bg-wrf-coral px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wrf-coral focus-visible:ring-offset-2 lg:px-5"
              >
                {(currentLocale === 'en' && adminData?.donationButtonText) || t('header.donate')}
              </Link>
            )}

            <div className="relative shrink-0" ref={langDropdownDesktopRef}>
              <button
                id="desktopLangToggleBtn"
                type="button"
                className="flex h-12 flex-row items-center justify-center gap-2 rounded-full bg-wrf-purple px-4 pe-4 text-base font-bold text-white lg:px-5 lg:text-lg"
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLangDropdownOpen((prev) => !prev);
                }}
              >
                <span>{currentLocaleLabel}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div
                id="desktopLangDropdown"
                role="menu"
                aria-hidden={!langDropdownOpen}
                className="absolute right-0 top-full z-[100] mt-1 min-w-[180px] rounded-md border border-gray-200 bg-white py-2 shadow-lg"
                style={{ display: langDropdownOpen ? 'block' : 'none' }}
              >
                {otherLocales.map((loc) => (
                  <Link
                    key={loc.code}
                    href={loc.code === 'en' ? `/en${pathWithoutLocale}` : `/${loc.code}${pathWithoutLocale}`}
                    role="menuitem"
                    className="block px-4 py-3 font-medium transition-colors first:rounded-t-md hover:bg-slate-100"
                    onClick={() => setLangDropdownOpen(false)}
                  >
                    {loc.label}
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-wrf-black text-white transition-colors hover:opacity-90"
              aria-label={menuOpen ? t('header.menu.close') : t('header.menu.open')}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:hidden">
            {currentLocale === 'en' && (
              <Link href={`${localePrefix}/${adminData?.donationButtonLink || 'Donate'}`} className="inline-flex h-9 items-center justify-center rounded-none bg-wrf-coral px-2.5 text-[11px] font-bold uppercase tracking-wider text-white sm:h-10 sm:px-4 sm:text-xs">
                {(currentLocale === 'en' && adminData?.donationButtonText) || t('header.donateMobile')}
              </Link>
            )}
            <div className="relative" ref={langDropdownMobileRef}>
              <button
                type="button"
                className="flex h-9 flex-row items-center justify-center gap-1 rounded-full bg-wrf-purple px-2.5 text-xs font-bold text-white sm:h-10 sm:px-4 sm:text-sm"
                aria-expanded={langDropdownOpen}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLangDropdownOpen((prev) => !prev);
                }}
              >
                <span>{currentLocaleLabel}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={langDropdownOpen ? 'rotate-180' : ''}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full z-[100] mt-1 min-w-[160px] rounded-md border border-gray-200 bg-white py-2 shadow-lg" role="menu">
                  {otherLocales.map((loc) => (
                    <Link
                      key={loc.code}
                      href={loc.code === 'en' ? `/en${pathWithoutLocale}` : `/${loc.code}${pathWithoutLocale}`}
                      className="block px-4 py-3 font-medium transition-colors first:rounded-t-md hover:bg-slate-100"
                      onClick={() => setLangDropdownOpen(false)}
                    >
                      {loc.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-none bg-wrf-black text-white transition-colors hover:opacity-90 sm:h-12 sm:w-12"
              aria-label={menuOpen ? t('header.menu.close') : t('header.menu.open')}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full-width hamburger dropdown (onclick) - matches HTML structure */}
      {menuOpen && (
        <div
          className="absolute left-0 top-full w-full overflow-hidden bg-wrf-black text-white"
          style={{ height: 'auto', opacity: 1 }}
        >
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
            {/* Desktop: 4-column grid */}
            <div className="hidden lg:block">
              <div className="mb-12 grid grid-cols-4 gap-8">
                {MENU_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <h3 className={`mb-6 text-lg font-bold uppercase ${section.titleClass}`}>
                      {section.title}
                    </h3>
                    <ul className="space-y-4">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={`${localePrefix}${link.href}`}
                            className="font-body text-white transition-colors hover:text-wrf-coral"
                            onClick={closeMenu}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-gray-700 pt-8">
                <p className="text-lg text-white">{(currentLocale === 'en' && adminData?.megaFooterText) || t('header.menu.cta')}</p>
                <div className="flex items-center gap-6">
                  {currentLocale === 'en' && (
                    <Link
                      href={`${localePrefix}/${adminData?.megaFooterBtn1Link || 'Donate'}`}
                      className="flex h-12 items-center bg-wrf-coral px-6 font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                      onClick={closeMenu}
                    >
                      {(currentLocale === 'en' && adminData?.megaFooterBtn1Text) || t('header.donateMobile')}
                    </Link>
                  )}
                  <Link
                    href={`${localePrefix}/${adminData?.megaFooterBtn2Link || 'Contact'}`}
                    className="flex h-12 items-center bg-wrf-purple px-6 font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                    onClick={closeMenu}
                  >
                    {(currentLocale === 'en' && adminData?.megaFooterBtn2Text) || t('header.menu.getInTouch')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile: accordion */}
            <div className="space-y-2 lg:hidden">
              {MENU_SECTIONS.map((section, index) => (
                <div key={section.title} className="border-b border-gray-700">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-left"
                    onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                    aria-expanded={openAccordion === index}
                  >
                    <h3 className={`text-lg font-bold uppercase ${section.titleClass}`}>
                      {section.title}
                    </h3>
                    <ChevronDown open={openAccordion === index} />
                  </button>
                  {openAccordion === index && (
                    <ul className="space-y-3 pb-4 pl-0">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={`${localePrefix}${link.href}`}
                            className="block text-white transition-colors hover:text-wrf-coral"
                            onClick={closeMenu}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div className="space-y-4 pt-6">
                {currentLocale === 'en' && (
                  <Link
                    href={`${localePrefix}/${adminData?.megaFooterBtn1Link || 'Donate'}`}
                    className="flex h-12 w-full items-center justify-center bg-wrf-coral font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                    onClick={closeMenu}
                  >
                    {(currentLocale === 'en' && adminData?.megaFooterBtn1Text) || t('header.donateMobile')}
                  </Link>
                )}
                <Link
                  href={`${localePrefix}/${adminData?.megaFooterBtn2Link || 'Contact'}`}
                  className="flex h-12 w-full items-center justify-center bg-wrf-purple font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                  onClick={closeMenu}
                >
                  {(currentLocale === 'en' && adminData?.megaFooterBtn2Text) || t('header.menu.getInTouch')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
