'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const PAGE_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'programs', label: 'Programs' },
  { value: 'contact', label: 'Contact' },
  { value: 'donate', label: 'Donate' },
  { value: 'news', label: 'News' },
  { value: 'team', label: 'Team' },
  { value: 'faq', label: 'FAQ' },
  { value: 'founders', label: 'Founders' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'vacancies', label: 'Vacancies' },
  { value: 'privacy', label: 'Privacy Policy' },
];

type PageSettings = {
  pageTitle: string;
  pageSubtitle: string;
  heroBgImageUrl: string;
  heroTriangleImageUrl: string;
  heroTitleBgColor: string;
  heroTitleTextColor: string;
  heroSubtitleTextColor: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  quoteText: string;
  quoteAuthorName: string;
  quoteAuthorTitle: string;
  quoteAuthorImageUrl: string;
  ogShareTitle: string;
  ogShareImage: string;
  ogShareDescription: string;
  twitterTitle: string;
  twitterImage: string;
  twitterDescription: string;
  metaTitle: string;
  metaDescription: string;
};

const PAGE_DEFAULT_TITLES: Record<string, { pageTitle: string; metaTitle: string }> = {
  home: { pageTitle: "Women's Rights First", metaTitle: "Women's Rights First" },
  about: { pageTitle: 'About Us', metaTitle: 'About Us | Women\'s Rights First' },
  programs: { pageTitle: 'Our Programs', metaTitle: 'Our Programs | Women\'s Rights First' },
  contact: { pageTitle: 'Contact Us', metaTitle: 'Contact Us | Women\'s Rights First' },
  donate: { pageTitle: 'Donate', metaTitle: 'Donate | Women\'s Rights First' },
  news: { pageTitle: 'News & Updates', metaTitle: 'News | Women\'s Rights First' },
  team: { pageTitle: 'Our Team', metaTitle: 'Our Team | Women\'s Rights First' },
  faq: { pageTitle: 'FAQ', metaTitle: 'FAQ | Women\'s Rights First' },
  founders: { pageTitle: 'Our Founders', metaTitle: 'Our Founders | Women\'s Rights First' },
  volunteer: { pageTitle: 'Volunteer', metaTitle: 'Volunteer | Women\'s Rights First' },
  partnership: { pageTitle: 'Partnership', metaTitle: 'Partnership | Women\'s Rights First' },
  vacancies: { pageTitle: 'Vacancies', metaTitle: 'Vacancies | Women\'s Rights First' },
  privacy: { pageTitle: 'Privacy Policy', metaTitle: 'Privacy Policy | Women\'s Rights First' },
};

const defaultPageSettings = (pageKey?: string): PageSettings => {
  const titles = (pageKey && PAGE_DEFAULT_TITLES[pageKey]) || PAGE_DEFAULT_TITLES.home;
  return {
    pageTitle: titles.pageTitle,
    pageSubtitle: '',
    heroBgImageUrl: '/images/GettyImages-1232002648.jpg',
    heroTriangleImageUrl: '/images/Element-2-03-scaled.png',
    heroTitleBgColor: 'bg-secondary',
    heroTitleTextColor: 'text-white',
    heroSubtitleTextColor: 'text-white/90',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    quoteText: '',
    quoteAuthorName: '',
    quoteAuthorTitle: '',
    quoteAuthorImageUrl: '',
    ogShareTitle: '',
    ogShareImage: '',
    ogShareDescription: '',
    twitterTitle: '',
    twitterImage: '',
    twitterDescription: '',
    metaTitle: titles.metaTitle,
    metaDescription: '',
  };
};

function mergePageSettings(partial: Record<string, any> | null | undefined, pageKey?: string): PageSettings {
  const d = defaultPageSettings(pageKey);
  if (!partial || typeof partial !== 'object') return d;
  const out = { ...d };
  (Object.keys(d) as (keyof PageSettings)[]).forEach((k) => {
    if (partial[k] !== undefined && partial[k] !== null) (out as any)[k] = partial[k];
  });
  return out;
}

const HERO_TITLE_BG_OPTIONS = [
  { value: 'bg-primary', label: 'Primary (Dark)' },
  { value: 'bg-secondary', label: 'Secondary (Purple)' },
  { value: 'bg-accent', label: 'Accent (Pink)' },
  { value: 'bg-support-1', label: 'Support (Rose)' },
];

const HERO_TEXT_COLOR_OPTIONS = [
  { value: 'text-white', label: 'White Text' },
  { value: 'text-primary', label: 'Primary (Dark)' },
  { value: 'text-secondary', label: 'Secondary (Purple)' },
];

const HERO_SUBTITLE_COLOR_OPTIONS = [
  { value: 'text-white/90', label: 'Light White' },
  { value: 'text-gray-200', label: 'Gray Light' },
  { value: 'text-white', label: 'White' },
];

function SaveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save w-4 h-4 mr-2">
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  );
}

function getInitialSettingsByPage(): Record<string, PageSettings> {
  const init: Record<string, PageSettings> = {};
  PAGE_OPTIONS.forEach((o) => {
    init[o.value] = defaultPageSettings(o.value);
  });
  return init;
}

export default function PageSettingManagementPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [activeTab, setActiveTab] = useState<'individual' | 'sitewide'>('individual');
  const [selectedPage, setSelectedPage] = useState('home');
  const [settingsByPage, setSettingsByPage] = useState<Record<string, PageSettings>>(getInitialSettingsByPage);
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  const currentSettings = mergePageSettings(settingsByPage[selectedPage], selectedPage);
  const selectedPageLabel = PAGE_OPTIONS.find((o) => o.value === selectedPage)?.label ?? selectedPage;

  const updateCurrentPage = (updates: Partial<PageSettings>) => {
    setSettingsByPage((prev) => ({
      ...prev,
      [selectedPage]: mergePageSettings({ ...(prev[selectedPage] || {}), ...updates }, selectedPage),
    }));
  };

  useEffect(() => {
    loadAdminData<Record<string, any>>('page-settings').then((data) => {
      if (!data) return;
      if (data.pages && typeof data.pages === 'object') {
        const pages: Record<string, PageSettings> = {};
        PAGE_OPTIONS.forEach((o) => {
          pages[o.value] = mergePageSettings(data.pages[o.value], o.value);
        });
        setSettingsByPage(pages);
        if (data.selectedPage && PAGE_OPTIONS.some((p) => p.value === data.selectedPage))
          setSelectedPage(data.selectedPage);
      } else {
        const legacy = mergePageSettings(data, 'home');
        setSettingsByPage((prev) => {
          const next: Record<string, PageSettings> = {};
          PAGE_OPTIONS.forEach((o) => {
            next[o.value] = o.value === 'home' ? legacy : mergePageSettings(prev[o.value], o.value);
          });
          return next;
        });
        if (data.selectedPage) setSelectedPage(data.selectedPage);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    const payload = { pages: settingsByPage, selectedPage };
    const ok = await saveAdminData('page-settings', payload);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
  const textareaClass =
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const selectClass =
    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1';
  const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const cardHeaderClass = 'flex flex-col space-y-1.5 p-6';
  const cardTitleClass = 'text-2xl font-semibold leading-none tracking-tight';
  const cardDescClass = 'text-sm text-muted-foreground';
  const sectionClass = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const gridClass = 'grid md:grid-cols-2 gap-4';
  const spaceYClass = 'p-6 pt-0 space-y-4';
  const spaceY6Class = 'p-6 pt-0 space-y-6';

  return (
    <AdminShell>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Page Content & SEO</h1>
            <p className="text-gray-600 font-body">Manage page content, SEO settings, and site-wide configurations.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-9 px-3 py-2 bg-secondary hover:bg-secondary/90"
            >
              <SaveIcon />
              Save Page Settings
            </button>
            {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
            {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('individual')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'individual' ? 'border-secondary text-secondary' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Individual Pages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sitewide')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sitewide' ? 'border-secondary text-secondary' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Site-Wide Settings
            </button>
          </nav>
        </div>

        {activeTab === 'individual' && (
          <div className="space-y-6">
            {/* Select Page to Edit */}
            <div className={sectionClass}>
              <div className={cardHeaderClass}>
                <h3 className={cardTitleClass}>Select Page to Edit</h3>
                <p className={cardDescClass}>Choose which page you want to customize</p>
              </div>
              <div className="p-6 pt-0">
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className={`${selectClass} w-full md:w-1/3`}
                >
                  {PAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {/* Page Content - title reflects selected page */}
              <div className={sectionClass}>
                <div className={cardHeaderClass}>
                  <h3 className={`${cardTitleClass} font-heading flex items-center gap-2`}>
                    <SettingsIcon className="lucide lucide-settings2 w-5 h-5" />
                    {selectedPageLabel} Page Content
                  </h3>
                  <p className={cardDescClass}>Configure the main content displayed on the {selectedPageLabel} page</p>
                </div>
                <div className={spaceY6Class}>
                  <div className="space-y-2">
                    <label className={labelClass}>Page Title (H1)</label>
                    <input
                      className={inputClass}
                      placeholder="Enter the main page title"
                      value={currentSettings.pageTitle}
                      onChange={(e) => updateCurrentPage({ pageTitle: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">The main heading visible at the top of the page.</p>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Page Subtitle</label>
                    <textarea
                      className={textareaClass}
                      placeholder="Enter a descriptive subtitle"
                      rows={3}
                      value={currentSettings.pageSubtitle}
                      onChange={(e) => updateCurrentPage({ pageSubtitle: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">The descriptive text that appears below the main title.</p>
                  </div>
                </div>
              </div>

              {/* Hero Section Design */}
              <div className={sectionClass}>
                <div className={cardHeaderClass}>
                  <h3 className={cardTitleClass}>Hero Section Design</h3>
                  <p className={cardDescClass}>Configure the visual hero section at the top of the page</p>
                </div>
                <div className={spaceYClass}>
                  <div className="space-y-2">
                    <label className={labelClass}>Hero Background Image URL</label>
                    <input
                      className={inputClass}
                      placeholder="https://example.com/hero-image.jpg"
                      value={currentSettings.heroBgImageUrl}
                      onChange={(e) => updateCurrentPage({ heroBgImageUrl: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">Background image for the header section of the page.</p>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Hero Triangle Image URL (Optional)</label>
                    <input
                      className={inputClass}
                      placeholder="https://example.com/triangle-image.jpg"
                      value={currentSettings.heroTriangleImageUrl}
                      onChange={(e) => updateCurrentPage({ heroTriangleImageUrl: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">Triangle-shaped overlay image for the right side of the hero section.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Hero Title Background Color</label>
                      <select
                        className={selectClass}
                        value={currentSettings.heroTitleBgColor}
                        onChange={(e) => updateCurrentPage({ heroTitleBgColor: e.target.value })}
                      >
                        {HERO_TITLE_BG_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Hero Title Text Color</label>
                      <select
                        className={selectClass}
                        value={currentSettings.heroTitleTextColor}
                        onChange={(e) => updateCurrentPage({ heroTitleTextColor: e.target.value })}
                      >
                        {HERO_TEXT_COLOR_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Hero Subtitle Text Color</label>
                    <select
                      className={`${selectClass} w-full md:w-1/2`}
                      value={currentSettings.heroSubtitleTextColor}
                      onChange={(e) => updateCurrentPage({ heroSubtitleTextColor: e.target.value })}
                    >
                      {HERO_SUBTITLE_COLOR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className={sectionClass}>
                <div className={cardHeaderClass}>
                  <h3 className={cardTitleClass}>Social Media Links</h3>
                  <p className={cardDescClass}>Configure social media profiles for this page</p>
                </div>
                <div className={spaceYClass}>
                  <div className={gridClass}>
                    <div className="space-y-2">
                      <label className={labelClass}>Facebook URL</label>
                      <input
                        className={inputClass}
                        placeholder="https://facebook.com/wrf"
                        value={currentSettings.facebookUrl}
                        onChange={(e) => updateCurrentPage({ facebookUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Twitter URL</label>
                      <input
                        className={inputClass}
                        placeholder="https://twitter.com/wrf"
                        value={currentSettings.twitterUrl}
                        onChange={(e) => updateCurrentPage({ twitterUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Instagram URL</label>
                      <input
                        className={inputClass}
                        placeholder="https://instagram.com/wrf"
                        value={currentSettings.instagramUrl}
                        onChange={(e) => updateCurrentPage({ instagramUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>LinkedIn URL</label>
                      <input
                        className={inputClass}
                        placeholder="https://linkedin.com/company/wrf"
                        value={currentSettings.linkedinUrl}
                        onChange={(e) => updateCurrentPage({ linkedinUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Quote */}
              <div className={sectionClass}>
                <div className={cardHeaderClass}>
                  <h3 className={cardTitleClass}>Featured Quote</h3>
                  <p className={cardDescClass}>Add an inspirational quote to display on this page</p>
                </div>
                <div className={spaceYClass}>
                  <div className="space-y-2">
                    <label className={labelClass}>Quote Text</label>
                    <textarea
                      className={textareaClass}
                      placeholder="Enter an inspiring quote"
                      rows={3}
                      value={currentSettings.quoteText}
                      onChange={(e) => updateCurrentPage({ quoteText: e.target.value })}
                    />
                  </div>
                  <div className={gridClass}>
                    <div className="space-y-2">
                      <label className={labelClass}>Quote Author Name</label>
                      <input
                        className={inputClass}
                        placeholder="Author Name"
                        value={currentSettings.quoteAuthorName}
                        onChange={(e) => updateCurrentPage({ quoteAuthorName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Quote Author Title</label>
                      <input
                        className={inputClass}
                        placeholder="CEO, Founder, etc."
                        value={currentSettings.quoteAuthorTitle}
                        onChange={(e) => updateCurrentPage({ quoteAuthorTitle: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Quote Author Image URL</label>
                    <input
                      className={inputClass}
                      placeholder="https://example.com/author-photo.jpg"
                      value={currentSettings.quoteAuthorImageUrl}
                      onChange={(e) => updateCurrentPage({ quoteAuthorImageUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Sharing */}
              <div className={sectionClass}>
                <div className={cardHeaderClass}>
                  <h3 className={cardTitleClass}>Social Media Sharing</h3>
                  <p className={cardDescClass}>Control how this page appears when shared on social media platforms</p>
                </div>
                <div className="p-6 pt-0 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Open Graph (Facebook, LinkedIn)</h4>
                    <div className={gridClass}>
                      <div className="space-y-2">
                        <label className={labelClass}>Share Title</label>
                        <input
                          className={inputClass}
                          placeholder="Title when shared (leave empty to use page title)"
                          value={currentSettings.ogShareTitle}
                          onChange={(e) => updateCurrentPage({ ogShareTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Share Image</label>
                        <input
                          className={inputClass}
                          placeholder="https://example.com/share-image.jpg"
                          value={currentSettings.ogShareImage}
                          onChange={(e) => updateCurrentPage({ ogShareImage: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Recommended: 1200x630px</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Share Description</label>
                      <textarea
                        className={textareaClass}
                        placeholder="Description when shared (leave empty to use meta description)"
                        rows={2}
                        value={currentSettings.ogShareDescription}
                        onChange={(e) => updateCurrentPage({ ogShareDescription: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Twitter Cards</h4>
                    <div className={gridClass}>
                      <div className="space-y-2">
                        <label className={labelClass}>Twitter Title</label>
                        <input
                          className={inputClass}
                          placeholder="Twitter-specific title (optional)"
                          value={currentSettings.twitterTitle}
                          onChange={(e) => updateCurrentPage({ twitterTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Twitter Image</label>
                        <input
                          className={inputClass}
                          placeholder="https://example.com/twitter-image.jpg"
                          value={currentSettings.twitterImage}
                          onChange={(e) => updateCurrentPage({ twitterImage: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Recommended: 1200x675px</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Twitter Description</label>
                      <textarea
                        className={textareaClass}
                        placeholder="Twitter-specific description (optional)"
                        rows={2}
                        value={currentSettings.twitterDescription}
                        onChange={(e) => updateCurrentPage({ twitterDescription: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO & Meta Tags */}
              <div className={sectionClass}>
                <div className={cardHeaderClass}>
                  <h3 className={cardTitleClass}>SEO & Meta Tags</h3>
                  <p className={cardDescClass}>Optimize this page for search engines and social media sharing</p>
                </div>
                <div className={spaceYClass}>
                  <div className="space-y-2">
                    <label className={labelClass}>Meta Title</label>
                    <input
                      className={inputClass}
                      placeholder="SEO-optimized page title"
                      value={currentSettings.metaTitle}
                      onChange={(e) => updateCurrentPage({ metaTitle: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">Appears in browser tabs and search results. Keep under 60 characters.</p>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Meta Description</label>
                    <textarea
                      className={textareaClass}
                      placeholder="Brief description for search engines"
                      rows={3}
                      value={currentSettings.metaDescription}
                      onChange={(e) => updateCurrentPage({ metaDescription: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">Appears in search engine results. Keep under 160 characters.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sitewide' && (
          <div className="space-y-6">
            <div className={sectionClass}>
              <div className={cardHeaderClass}>
                <h3 className={cardTitleClass}>Site-Wide Settings</h3>
                <p className={cardDescClass}>Configure settings that apply across the entire website.</p>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">Site-wide options (e.g. default SEO, default social links) can be added here.</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminShell>
  );
}
