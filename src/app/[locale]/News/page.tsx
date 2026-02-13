'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';

function CategoryIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    'file-text': (
      <>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </>
    ),
    megaphone: (
      <>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </>
    ),
    calendar: (
      <>
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
    briefcase: (
      <>
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </>
    ),
  };
  const path = paths[name];
  if (!path) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      {path}
    </svg>
  );
}

export default function NewsPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(qFromUrl);

  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    fetch('/api/data/blog-posts', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
  }, []);
  useEffect(() => {
    setSearchQuery((prev) => (qFromUrl !== prev ? qFromUrl : prev));
  }, [qFromUrl]);

  const publishedPosts = useMemo(() => {
    if (!adminData?.posts?.length) return [];
    return adminData.posts.filter((p: any) => p.status === 'published');
  }, [adminData]);

  const filteredPosts = useMemo(() => {
    let posts = publishedPosts;
    if (activeCategory !== 'all') {
      posts = posts.filter((p: any) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      posts = posts.filter((p: any) =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
      );
    }
    return posts;
  }, [publishedPosts, activeCategory, searchQuery]);

  const CATEGORIES = [
    { id: 'all', label: t('news.categories.all'), count: publishedPosts.length, active: true, bgClass: 'bg-wrf-black border-wrf-black', icon: 'file-text' },
    { id: 'news', label: t('news.categories.news'), count: publishedPosts.filter((p: any) => p.category === 'news').length, active: false, bgClass: 'bg-wrf-purple border-transparent', icon: 'file-text' },
    { id: 'announcement', label: t('news.categories.announcement'), count: publishedPosts.filter((p: any) => p.category === 'announcement').length, active: false, bgClass: 'bg-wrf-coral border-transparent', icon: 'megaphone' },
    { id: 'event', label: t('news.categories.event'), count: publishedPosts.filter((p: any) => p.category === 'event').length, active: false, bgClass: 'bg-wrf-footer-mauve border-transparent', icon: 'calendar' },
    { id: 'statement', label: t('news.categories.statement'), count: publishedPosts.filter((p: any) => p.category === 'statement').length, active: false, bgClass: 'bg-wrf-black border-transparent', icon: 'briefcase' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied via searchQuery state and filteredPosts
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 text-left">
          <h1 className="font-heading mb-4 text-4xl font-bold leading-tight text-wrf-black lg:text-5xl">
            {t('news.hero.title')}
          </h1>
          <p className="font-body max-w-3xl text-lg leading-relaxed text-gray-700">
            {t('news.hero.description')}
          </p>
        </div>

        {/* Search form */}
        <div className="relative mb-12">
          <form onSubmit={handleSearch} className="flex max-w-2xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('news.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-body h-14 w-full rounded-l-md border-2 border-gray-300 bg-white pl-12 pr-4 text-base text-wrf-black placeholder:text-gray-400 focus:border-wrf-purple focus:outline-none focus:ring-2 focus:ring-wrf-purple/20 focus:ring-offset-0"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
              className="inline-flex h-14 items-center justify-center rounded-r-md border-2 border-wrf-purple bg-wrf-purple px-8 font-semibold text-white transition-colors hover:bg-wrf-purple-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-5 w-5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              {t('news.search.button')}
            </button>
          </form>
        </div>

        {/* Category filters */}
        <div className="mb-12 flex flex-wrap justify-start gap-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`cursor-pointer rounded-md border-2 font-medium shadow-md transition-all duration-300 hover:scale-[1.02] ${
                  isActive
                    ? 'scale-[1.02] border-wrf-black bg-wrf-black text-white shadow-lg'
                    : `border-transparent text-white ${cat.bgClass}`
                }`}
              >
                <div className="flex items-center gap-3 px-6 py-3">
                  <CategoryIcon name={cat.icon} />
                  <span className="text-xl font-bold">{cat.count}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider">{cat.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Posts grid / Empty state */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post: any) => (
              <article key={post.id} className="flex flex-col overflow-hidden bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
                {post.imageUrl && (
                  <div className="h-48 w-full overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3">
                    {post.category && (
                      <span className="bg-wrf-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-wrf-purple">
                        {post.category}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-wrf-black">{post.title}</h3>
                  {post.excerpt && (
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                  )}
                </div>
              </article>
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
              className="mx-auto mb-4 h-16 w-16 text-gray-300"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            <h2 className="text-xl font-semibold text-wrf-black">{t('news.empty.title')}</h2>
            <p className="mt-2 text-gray-500">{t('news.empty.description')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
