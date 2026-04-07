'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

const HERO_BG =
  '/images/FILE%20PHOTO%20Afghan%20women%27s%20rights%20defenders%20and%20civil%20activists%20protest%20to%20call%20on%20the%20Taliban%20for%20the%20preservation%20of%20their%20achievements%20and%20education%2C%20in%20front%20of%20the%20presidential%20palace%20in%20Kabul.jpg';
const HERO_RIGHT_IMAGE =
  '/images/Element-2-03-scaled.png';

type CategoryId = 'all' | 'general' | 'programs' | 'involved' | 'contact';

const CATEGORY_HEADER_BG: Record<CategoryId, string> = {
  all: 'bg-wrf-black',
  general: 'bg-wrf-purple',
  programs: 'bg-wrf-coral',
  involved: 'bg-wrf-footer-mauve',
  contact: 'bg-wrf-black',
};

const CATEGORY_BG: Record<CategoryId, string> = {
  all: 'bg-wrf-black',
  general: 'bg-wrf-purple',
  programs: 'bg-wrf-coral',
  involved: 'bg-wrf-footer-mauve',
  contact: 'bg-wrf-black',
};

const FAQ_ITEM_BG_MAP: Record<string, string> = {
  'bg-wrf-purple': 'bg-wrf-purple',
  'bg-wrf-purple-dark': 'bg-wrf-purple-dark',
  'bg-wrf-footer-mauve': 'bg-wrf-footer-mauve',
  'bg-wrf-coral': 'bg-wrf-coral',
  'bg-wrf-rose-dark': 'bg-wrf-rose-dark',
  'bg-wrf-footer-dark': 'bg-wrf-footer-dark',
  'bg-wrf-black': 'bg-wrf-black',
};
const FAQ_ITEM_TEXT_MAP: Record<string, string> = {
  'text-white': 'text-white',
  'text-white/90': 'text-white/90',
};


/** Lighten a hex color by a given amount (0–1) */
function lightenHex(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = Math.min(255, Math.round(parseInt(h.substring(0, 2), 16) + (255 - parseInt(h.substring(0, 2), 16)) * amount));
  const g = Math.min(255, Math.round(parseInt(h.substring(2, 4), 16) + (255 - parseInt(h.substring(2, 4), 16)) * amount));
  const b = Math.min(255, Math.round(parseInt(h.substring(4, 6), 16) + (255 - parseInt(h.substring(4, 6), 16)) * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Resolve category colorClass from admin (WRF or legacy) to a display class for sidebar and cards */
function resolveCategoryBg(colorClass: string | undefined): string {
  if (!colorClass) return 'bg-wrf-purple';
  if (FAQ_ITEM_BG_MAP[colorClass]) return colorClass;
  const legacy: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  return legacy[colorClass] || 'bg-wrf-purple';
}

function ChevronDown({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function FAQPage() {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryId>('all');

  const CATEGORIES = [
    { id: 'all' as CategoryId, label: t('faq.categories.all'), count: 6, bg: CATEGORY_BG['all'] },
    { id: 'general' as CategoryId, label: t('faq.categories.general'), count: 2, bg: CATEGORY_BG['general'] },
    { id: 'programs' as CategoryId, label: t('faq.categories.programs'), count: 1, bg: CATEGORY_BG['programs'] },
    { id: 'involved' as CategoryId, label: t('faq.categories.involved'), count: 1, bg: CATEGORY_BG['involved'] },
    { id: 'contact' as CategoryId, label: t('faq.categories.contact'), count: 2, bg: CATEGORY_BG['contact'] },
  ];

  /** Reference image hex colors per question panel */
  const FAQ_ITEMS: Array<{
    id: string;
    question: string;
    answer: string;
    category: CategoryId;
    categoryLabel: string;
    backgroundColor?: string;
    textColor?: string;
    categoryBg?: string;
  }> = [
    {
      id: '1',
      question: t('faq.q1'),
      answer: t('faq.a1'),
      category: 'general',
      categoryLabel: t('faq.categories.general'),
      backgroundColor: '#6A4B92',
      textColor: 'text-white',
    },
    {
      id: '2',
      question: t('faq.q2'),
      answer: t('faq.a2'),
      category: 'involved',
      categoryLabel: t('faq.categories.involved'),
      backgroundColor: '#573E80',
      textColor: 'text-white',
    },
    {
      id: '3',
      question: t('faq.q3'),
      answer: t('faq.a3'),
      category: 'contact',
      categoryLabel: t('faq.categories.contact'),
      backgroundColor: '#B78CA3',
      textColor: 'text-white',
    },
    {
      id: '4',
      question: t('faq.q4'),
      answer: t('faq.a4'),
      category: 'programs',
      categoryLabel: t('faq.categories.programs'),
      backgroundColor: '#DA777D',
      textColor: 'text-white',
    },
    {
      id: '5',
      question: t('faq.q5'),
      answer: t('faq.a5'),
      category: 'general',
      categoryLabel: t('faq.categories.general'),
      backgroundColor: '#7C607A',
      textColor: 'text-white',
    },
    {
      id: '6',
      question: t('faq.q6'),
      answer: t('faq.a6'),
      category: 'contact',
      categoryLabel: t('faq.categories.contact'),
      backgroundColor: '#1A1A1A',
      textColor: 'text-white',
    },
  ];

  const adminData = useCmsData<Record<string, any>>('faqs');

  const displayCategories = adminData && adminData.categories?.length > 0
    ? [
        { id: 'all' as CategoryId, label: t('faq.categories.all'), count: 0, bg: 'bg-wrf-black' },
        ...[...((adminData.categories) || [])]
          .sort((a: any, b: any) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
          .map((c: any) => ({
            id: c.id as CategoryId,
            label: c.name,
            count: 0,
            bg: resolveCategoryBg(c.colorClass || c.color),
          })),
      ]
    : CATEGORIES;

  const displayFAQs = adminData && adminData.faqs?.length > 0
    ? [...adminData.faqs]
        .filter((f: any) => f.isActive !== false)
        .sort((a: any, b: any) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
        .map((f: any) => {
          const cat = adminData.categories?.find((c: any) => c.id === f.categoryId);
          const categoryBg = resolveCategoryBg(cat?.colorClass || cat?.color);
          return {
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.categoryId as CategoryId,
            categoryLabel: cat?.name || f.categoryId,
            backgroundColor: f.backgroundColor,
            textColor: f.textColor,
            categoryBg,
          };
        })
    : FAQ_ITEMS;

  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const filtered = useMemo(() => {
    let list = displayFAQs;
    if (category !== 'all') list = list.filter((item: any) => item.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (item: any) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, search, displayFAQs]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div
          className="absolute right-0 top-0 hidden h-full w-2/5 bg-cover bg-center md:block"
          style={{
            backgroundImage: `url(${HERO_RIGHT_IMAGE})`,
            clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="bg-wrf-purple px-8 py-6">
              <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
                {t('faq.hero.title')}
              </h1>
              <p className="text-xl leading-relaxed text-white/90">
                {t('faq.hero.description')}
              </p>
            </div>
            <form
              className="mt-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('faq.search.placeholder')}
                  className="h-14 flex-grow rounded-none border-2 border-transparent bg-white px-4 pl-4 pr-4 text-lg text-wrf-black placeholder:text-wrf-gray-text focus:border-wrf-coral focus:outline-none focus:ring-2 focus:ring-wrf-coral focus:ring-offset-2"
                />
                <button
                  type="submit"
                  className="inline-flex h-14 items-center justify-center gap-1 rounded-none border-2 border-wrf-coral bg-wrf-coral px-8 font-semibold text-white transition-colors hover:bg-wrf-coral/90 focus:outline-none focus:ring-2 focus:ring-wrf-coral focus:ring-offset-2"
                >
                  <SearchIcon className="mr-2 h-5 w-5 shrink-0" />
                  {t('faq.search.button')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ content */}
      <div className="bg-gray-50 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Sidebar - desktop */}
            <aside className="hidden lg:block lg:col-span-3">
              <nav>
                <h3 className="mb-4 text-xl font-bold text-wrf-black">
                  {t('faq.categories.heading')}
                </h3>
                <div className="flex flex-col space-y-2">
                  {displayCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`w-full rounded-none px-4 py-3 text-left font-body font-medium transition-none text-white ${cat.bg} ${category === cat.id ? 'ring-2 ring-white ring-inset' : ''}`}
                    >
                      {cat.label} ({cat.id === 'all' ? displayFAQs.length : displayFAQs.filter((f: any) => f.category === cat.id).length})
                    </button>
                  ))}
                </div>
              </nav>
            </aside>

            <main className="lg:col-span-9">
              {/* Mobile category pills */}
              <div className="mb-8 flex flex-wrap gap-3 lg:hidden">
                {displayCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`w-full rounded-none px-4 py-3 text-left font-body font-medium text-white transition-none sm:w-auto ${cat.bg} ${category === cat.id ? 'ring-2 ring-white ring-inset' : ''}`}
                  >
                    {cat.label} ({cat.id === 'all' ? displayFAQs.length : displayFAQs.filter((f: any) => f.category === cat.id).length})
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="rounded-none bg-white p-8 shadow-md">
                    <p className="text-wrf-gray-text">{t('faq.empty')}</p>
                  </div>
                ) : (
                  filtered.map((item: any) => {
                    const isOpen = openId === item.id;
                    const isHexBg = typeof item.backgroundColor === 'string' && item.backgroundColor.startsWith('#');
                    const headerBgClass = !isHexBg ? (FAQ_ITEM_BG_MAP[item.backgroundColor] || item.categoryBg || (CATEGORY_HEADER_BG as Record<string, string>)[item.category] || 'bg-wrf-purple') : '';
                    const headerBgStyle = isHexBg ? { backgroundColor: item.backgroundColor } : undefined;
                    const questionTextClass = FAQ_ITEM_TEXT_MAP[item.textColor] || 'text-white';
                    return (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-none bg-white shadow-md"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                          className={`w-full p-6 text-left transition-colors duration-200 ${questionTextClass} ${headerBgClass}`}
                          style={headerBgStyle}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold leading-tight">
                                {item.question}
                              </h3>
                              <span className="mt-2 inline-block rounded px-3 py-1 text-xs font-medium uppercase tracking-wider text-white" style={{ backgroundColor: isHexBg ? lightenHex(item.backgroundColor, 0.3) : 'rgba(255,255,255,0.2)' }}>
                                {item.categoryLabel}
                              </span>
                            </div>
                            <div
                              className="mt-1 flex-shrink-0 transition-transform duration-200"
                              style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                            >
                              <ChevronDown className="h-6 w-6" />
                            </div>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="border-t-2 border-gray-100 bg-white p-6">
                            <div className="prose max-w-none text-gray-700 leading-relaxed">
                              {item.answer.split('\n').map((para: string, i: number) => (
                                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                                  {para}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
