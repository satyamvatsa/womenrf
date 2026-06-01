'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';

const APPLICATION_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSeIOe382YD2bmhV1lAQ1kEg5Qw3ax4QHA7thUr8arI0yw-utQ/viewform';
const STORAGE_KEY = 'wrf_fellowship_popup_dismissed';

export default function FellowshipPopup() {
  // Temporarily disabled — set to true to re-enable
  const ENABLED = false;

  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const { localePrefix } = useTranslation();

  useEffect(() => {
    if (!ENABLED) return;

    // Only show on the homepage (locale root paths like /en, /fa, /ps)
    const segments = (pathname ?? '').split('/').filter(Boolean);
    const isHome = segments.length <= 1;
    if (!isHome) return;

    // Check if user dismissed it this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // sessionStorage not available
    }

    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [pathname, ENABLED]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Digital Futures Fellowship announcement"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header gradient */}
        <div className="bg-gradient-to-br from-wrf-purple to-wrf-coral px-8 pt-8 pb-6 text-white text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            Now Accepting Applications
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-2">
            Digital Futures Fellowship
          </h2>
          <p className="text-white/80 text-sm">
            For Afghan Women &amp; Girls Inside Afghanistan
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          <p className="text-wrf-black text-sm leading-relaxed text-center">
            A <strong>four-month online fellowship</strong> running <strong>July – October 2026</strong>, equipping Afghan women
            and girls with digital skills in content creation, AI tools, website development, and more.
          </p>

          {/* Key dates */}
          <div className="bg-[#f9f7ff] rounded-xl p-4 grid grid-cols-2 gap-3 text-center text-xs">
            <div>
              <div className="text-wrf-gray-text">Applications Close</div>
              <div className="font-bold text-wrf-purple text-sm mt-0.5">May 30, 2026</div>
            </div>
            <div>
              <div className="text-wrf-gray-text">Fellows Notified</div>
              <div className="font-bold text-wrf-purple text-sm mt-0.5">End of June 2026</div>
            </div>
          </div>

          {/* Quick eligibility */}
          <ul className="space-y-1.5 text-sm text-wrf-black">
            {[
              'Currently residing inside Afghanistan',
              'Afghan women or girls, 18+ years old',
              'Intermediate English skills',
            ].map((req) => (
              <li key={req} className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-wrf-purple flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer CTAs */}
        <div className="px-8 pb-7 flex flex-col sm:flex-row gap-3">
          <a
            href={APPLICATION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-wrf-purple text-white font-bold py-3 rounded-full hover:bg-wrf-purple-dark transition-colors duration-200"
            onClick={dismiss}
          >
            Apply Now
          </a>
          <Link
            href={`${localePrefix}/Fellowship`}
            className="flex-1 text-center border-2 border-wrf-purple text-wrf-purple font-semibold py-3 rounded-full hover:bg-wrf-purple/5 transition-colors duration-200"
            onClick={dismiss}
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
