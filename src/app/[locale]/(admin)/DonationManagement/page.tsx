'use client';

import { useState, useEffect } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const TITLE_BG_OPTIONS = [
  { value: 'bg-primary', label: 'Primary' },
  { value: 'bg-secondary', label: 'Secondary' },
  { value: 'bg-accent', label: 'Accent' },
  { value: 'bg-support-1', label: 'Support' },
];

const TITLE_TEXT_OPTIONS = [
  { value: 'text-white', label: 'White' },
  { value: 'text-primary', label: 'Primary' },
];

const SUBTITLE_TEXT_OPTIONS = [
  { value: 'text-white/90', label: 'White (90%)' },
  { value: 'text-white', label: 'White' },
  { value: 'text-gray-600', label: 'Gray' },
];

const defaultHero = {
  pageTitle: 'Support Our Mission',
  subtitle:
    "Your generous support enables Women's Rights First to continue our vital work in defending the rights, dignity, and freedom of Afghan women and girls.",
  heroBackgroundImageUrl:
    '/images/GettyImages-1232002648.jpg',
  heroTriangleImageUrl:
    '/images/Element-2-03-scaled.png',
  titleBackgroundColor: 'bg-primary',
  titleTextColor: 'text-white',
  subtitleTextColor: 'text-white/90',
};

export default function DonationManagementPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'content'>('hero');
  const [pageTitle, setPageTitle] = useState(defaultHero.pageTitle);
  const [subtitle, setSubtitle] = useState(defaultHero.subtitle);
  const [heroBackgroundImageUrl, setHeroBackgroundImageUrl] = useState(defaultHero.heroBackgroundImageUrl);
  const [heroTriangleImageUrl, setHeroTriangleImageUrl] = useState(defaultHero.heroTriangleImageUrl);
  const [titleBackgroundColor, setTitleBackgroundColor] = useState(defaultHero.titleBackgroundColor);
  const [titleTextColor, setTitleTextColor] = useState(defaultHero.titleTextColor);
  const [subtitleTextColor, setSubtitleTextColor] = useState(defaultHero.subtitleTextColor);

  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    loadAdminData<Record<string, any>>('donations').then(data => {
      if (!data) return;
      if (data.pageTitle !== undefined) setPageTitle(data.pageTitle);
      if (data.subtitle !== undefined) setSubtitle(data.subtitle);
      if (data.heroBackgroundImageUrl !== undefined) setHeroBackgroundImageUrl(data.heroBackgroundImageUrl);
      if (data.heroTriangleImageUrl !== undefined) setHeroTriangleImageUrl(data.heroTriangleImageUrl);
      if (data.titleBackgroundColor !== undefined) setTitleBackgroundColor(data.titleBackgroundColor);
      if (data.titleTextColor !== undefined) setTitleTextColor(data.titleTextColor);
      if (data.subtitleTextColor !== undefined) setSubtitleTextColor(data.subtitleTextColor);
    });
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    const data = {
      pageTitle, subtitle,
      heroBackgroundImageUrl, heroTriangleImageUrl,
      titleBackgroundColor, titleTextColor, subtitleTextColor,
    };
    const ok = await saveAdminData('donations', data);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
  const textareaClass =
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const labelClass = 'block text-sm font-medium mb-2';
  const cardClass = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const btnPrimary =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 px-3 py-2 bg-primary hover:bg-primary/90';

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Donation Page Management</h1>
          <p className="text-gray-600 font-body mt-2">
            Customize the donation page hero section and &quot;Other Ways to Give&quot; content.
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full" dir="ltr">
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 grid w-full grid-cols-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hero'}
              aria-controls="donation-tabpanel-hero"
              id="donation-tab-hero"
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === 'hero' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
              onClick={() => setActiveTab('hero')}
            >
              Hero Section
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'content'}
              aria-controls="donation-tabpanel-content"
              id="donation-tab-content"
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === 'content' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
              onClick={() => setActiveTab('content')}
            >
              Other Ways to Give
            </button>
          </div>

          {/* Hero Section tab panel */}
          <div
            role="tabpanel"
            id="donation-tabpanel-hero"
            aria-labelledby="donation-tab-hero"
            tabIndex={0}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            hidden={activeTab !== 'hero'}
          >
            <div className={cardClass}>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Hero Section Settings</h3>
              </div>
              <div className="p-6 pt-0">
                <form onSubmit={handleSaveHero} className="space-y-4">
                  <div>
                    <label className={labelClass}>Page Title</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Support Our Mission"
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subtitle</label>
                    <textarea
                      className={textareaClass}
                      placeholder="Your generous contribution empowers us..."
                      rows={3}
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Hero Background Image URL</label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://example.com/hero-image.jpg"
                      value={heroBackgroundImageUrl}
                      onChange={(e) => setHeroBackgroundImageUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Hero Triangle Image URL</label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://example.com/triangle-image.jpg"
                      value={heroTriangleImageUrl}
                      onChange={(e) => setHeroTriangleImageUrl(e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Title Background Color</label>
                      <select
                        className={inputClass}
                        value={titleBackgroundColor}
                        onChange={(e) => setTitleBackgroundColor(e.target.value)}
                      >
                        {TITLE_BG_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Title Text Color</label>
                      <select
                        className={inputClass}
                        value={titleTextColor}
                        onChange={(e) => setTitleTextColor(e.target.value)}
                      >
                        {TITLE_TEXT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Subtitle Text Color</label>
                      <select
                        className={inputClass}
                        value={subtitleTextColor}
                        onChange={(e) => setSubtitleTextColor(e.target.value)}
                      >
                        {SUBTITLE_TEXT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className={btnPrimary}>
                    Save Hero Section
                  </button>
                  {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
                  {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
                  {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
                </form>
              </div>
            </div>
          </div>

          {/* Other Ways to Give tab panel */}
          <div
            role="tabpanel"
            id="donation-tabpanel-content"
            aria-labelledby="donation-tab-content"
            tabIndex={0}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            hidden={activeTab !== 'content'}
          >
            <div className={cardClass}>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Other Ways to Give</h3>
                <p className="text-sm text-gray-500">
                  Configure alternative giving options and content for this section.
                </p>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-gray-500">Content settings for this section can be added here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
