'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';

function getLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && ['en', 'fa', 'ps'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '/en';
}

export default function LatestNews() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const currentLocale = localePrefix.replace('/', '');
  const { t } = useTranslation();

  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  const [newsData, setNewsData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetch('/api/data/homepage', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
    fetch('/api/data/news', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setNewsData(d); })
      .catch(() => {});
  }, []);

  const showNews = adminData?.showNews !== undefined ? adminData.showNews : true;
  const title = (currentLocale === 'en' && adminData?.newsTitle) || t('latestNews.title');
  const subtitle = (currentLocale === 'en' && adminData?.newsSubtitle) || t('latestNews.subtitle');
  const titleBg = adminData?.newsTitleBg || 'bg-primary';
  const buttonColor = adminData?.newsButtonColor || 'bg-primary';

  const BG_MAP: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  const titleBgClass = BG_MAP[titleBg] || 'bg-wrf-black';
  const btnBgClass = BG_MAP[buttonColor] || 'bg-wrf-black';

  if (!showNews) return null;

  const FALLBACK_POSTS = [
    { title: 'Empowering Afghan Women Through Education', summary: 'Our latest initiative brings educational resources to women and girls across Afghanistan.', imageUrl: '/images/7.jpeg', slug: '' },
    { title: 'Annual Report 2024 Released', summary: 'Read about our achievements, impact, and plans for the future.', imageUrl: '/images/teams.jpeg', slug: '' },
    { title: 'Partnership with International Organizations', summary: 'New collaborations strengthen our mission to protect women\'s rights.', imageUrl: '/images/IMG_3571.jpeg', slug: '' },
  ];

  const posts = newsData?.posts?.length
    ? newsData.posts.slice(0, 3)
    : FALLBACK_POSTS;

  return (
    <section id="latest-news" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <div className={`mb-4 inline-block ${titleBgClass} px-8 py-6`}>
            <h2 className="text-4xl font-bold text-white">{title}</h2>
          </div>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any, i: number) => (
            <div key={i} className="flex flex-col overflow-hidden bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
              {post.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex flex-grow flex-col p-6">
                <h3 className="mb-2 text-lg font-bold text-wrf-black">{post.title}</h3>
                {post.summary && (
                  <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-600">{post.summary}</p>
                )}
                {post.date && (
                  <p className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-left">
          <Link
            href={`${localePrefix}/News`}
            className={`inline-flex items-center gap-2 ${btnBgClass} px-8 py-3 font-semibold text-white transition-colors hover:opacity-90`}
          >
            {t('latestNews.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
