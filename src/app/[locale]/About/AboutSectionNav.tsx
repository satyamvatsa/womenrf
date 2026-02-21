'use client';

import { useEffect, useState, useRef } from 'react';
import NavIcon from './NavIcon';
import { useTranslation } from '@/lib/TranslationContext';

const SECTION_IDS = ['vision', 'mission', 'values', 'operations', 'quote', 'history', 'impact', 'team', 'links'];

export default function AboutSectionNav() {
  const { t } = useTranslation();
  const [activeHash, setActiveHash] = useState('#vision');
  const manualClick = useRef(false);

  const NAV_LINKS = [
    { href: '#vision', label: 'OUR VISION', icon: 'eye' },
    { href: '#mission', label: t('about.nav.mission'), icon: 'hand-heart' },
    { href: '#values', label: t('about.nav.values'), icon: 'book-open' },
    { href: '#operations', label: 'AREAS OF OPERATIONS', icon: 'globe' },
    { href: '#history', label: t('about.nav.journey'), icon: 'milestone' },
    { href: '#impact', label: t('about.nav.impact'), icon: 'chart-column' },
    { href: '#team', label: t('about.nav.people'), icon: 'users' },
  ];

  useEffect(() => {
    if (window.location.hash) {
      setActiveHash(window.location.hash);
    }

    const elements = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (manualClick.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="bg-gray-50 shadow-md py-4 border-b border-gray-200"
      aria-label="About page sections"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex -mx-4 justify-start overflow-x-auto whitespace-nowrap">
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = activeHash === href;
            return (
              <a
                key={href}
                href={href}
                onClick={() => {
                  setActiveHash(href);
                  manualClick.current = true;
                  setTimeout(() => { manualClick.current = false; }, 800);
                }}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-bold font-sans uppercase tracking-wider text-wrf-black transition-all duration-300 border-b-4 ${
                  isActive
                    ? 'border-gray-700'
                    : 'border-transparent'
                }`}
              >
                <NavIcon name={icon} />
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
