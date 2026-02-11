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

export default function PageSettingManagementPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [activeTab, setActiveTab] = useState<'individual' | 'sitewide'>('individual');
  const [selectedPage, setSelectedPage] = useState('home');

  // Home page content
  const [pageTitle, setPageTitle] = useState("Women's Rights First");
  const [pageSubtitle, setPageSubtitle] = useState('');

  // Hero section design
  const [heroBgImageUrl, setHeroBgImageUrl] = useState(
    '/images/GettyImages-1232002648.jpg'
  );
  const [heroTriangleImageUrl, setHeroTriangleImageUrl] = useState(
    '/images/Element-2-03-scaled.png'
  );
  const [heroTitleBgColor, setHeroTitleBgColor] = useState('bg-secondary');
  const [heroTitleTextColor, setHeroTitleTextColor] = useState('text-white');
  const [heroSubtitleTextColor, setHeroSubtitleTextColor] = useState('text-white/90');

  // Social media links
  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Featured quote
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthorName, setQuoteAuthorName] = useState('');
  const [quoteAuthorTitle, setQuoteAuthorTitle] = useState('');
  const [quoteAuthorImageUrl, setQuoteAuthorImageUrl] = useState('');

  // Social media sharing - Open Graph
  const [ogShareTitle, setOgShareTitle] = useState('');
  const [ogShareImage, setOgShareImage] = useState('');
  const [ogShareDescription, setOgShareDescription] = useState('');

  // Twitter Cards
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');

  // SEO & Meta
  const [metaTitle, setMetaTitle] = useState("Women's Rights First");
  const [metaDescription, setMetaDescription] = useState('');

  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    loadAdminData<Record<string, any>>('page-settings').then(data => {
      if (!data) return;
      if (data.selectedPage !== undefined) setSelectedPage(data.selectedPage);
      if (data.pageTitle !== undefined) setPageTitle(data.pageTitle);
      if (data.pageSubtitle !== undefined) setPageSubtitle(data.pageSubtitle);
      if (data.heroBgImageUrl !== undefined) setHeroBgImageUrl(data.heroBgImageUrl);
      if (data.heroTriangleImageUrl !== undefined) setHeroTriangleImageUrl(data.heroTriangleImageUrl);
      if (data.heroTitleBgColor !== undefined) setHeroTitleBgColor(data.heroTitleBgColor);
      if (data.heroTitleTextColor !== undefined) setHeroTitleTextColor(data.heroTitleTextColor);
      if (data.heroSubtitleTextColor !== undefined) setHeroSubtitleTextColor(data.heroSubtitleTextColor);
      if (data.facebookUrl !== undefined) setFacebookUrl(data.facebookUrl);
      if (data.twitterUrl !== undefined) setTwitterUrl(data.twitterUrl);
      if (data.instagramUrl !== undefined) setInstagramUrl(data.instagramUrl);
      if (data.linkedinUrl !== undefined) setLinkedinUrl(data.linkedinUrl);
      if (data.quoteText !== undefined) setQuoteText(data.quoteText);
      if (data.quoteAuthorName !== undefined) setQuoteAuthorName(data.quoteAuthorName);
      if (data.quoteAuthorTitle !== undefined) setQuoteAuthorTitle(data.quoteAuthorTitle);
      if (data.quoteAuthorImageUrl !== undefined) setQuoteAuthorImageUrl(data.quoteAuthorImageUrl);
      if (data.ogShareTitle !== undefined) setOgShareTitle(data.ogShareTitle);
      if (data.ogShareImage !== undefined) setOgShareImage(data.ogShareImage);
      if (data.ogShareDescription !== undefined) setOgShareDescription(data.ogShareDescription);
      if (data.twitterTitle !== undefined) setTwitterTitle(data.twitterTitle);
      if (data.twitterImage !== undefined) setTwitterImage(data.twitterImage);
      if (data.twitterDescription !== undefined) setTwitterDescription(data.twitterDescription);
      if (data.metaTitle !== undefined) setMetaTitle(data.metaTitle);
      if (data.metaDescription !== undefined) setMetaDescription(data.metaDescription);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    const data = {
      selectedPage, pageTitle, pageSubtitle,
      heroBgImageUrl, heroTriangleImageUrl, heroTitleBgColor, heroTitleTextColor, heroSubtitleTextColor,
      facebookUrl, twitterUrl, instagramUrl, linkedinUrl,
      quoteText, quoteAuthorName, quoteAuthorTitle, quoteAuthorImageUrl,
      ogShareTitle, ogShareImage, ogShareDescription,
      twitterTitle, twitterImage, twitterDescription,
      metaTitle, metaDescription,
    };
    const ok = await saveAdminData('page-settings', data);
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
              {/* Home Page Content */}
              <div className={sectionClass}>
                <div className={cardHeaderClass}>
                  <h3 className={`${cardTitleClass} font-heading flex items-center gap-2`}>
                    <SettingsIcon className="lucide lucide-settings2 w-5 h-5" />
                    Home Page Content
                  </h3>
                  <p className={cardDescClass}>Configure the main content displayed on the Home page</p>
                </div>
                <div className={spaceY6Class}>
                  <div className="space-y-2">
                    <label className={labelClass}>Page Title (H1)</label>
                    <input
                      className={inputClass}
                      placeholder="Enter the main page title"
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">The main heading visible at the top of the page.</p>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Page Subtitle</label>
                    <textarea
                      className={textareaClass}
                      placeholder="Enter a descriptive subtitle"
                      rows={3}
                      value={pageSubtitle}
                      onChange={(e) => setPageSubtitle(e.target.value)}
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
                      value={heroBgImageUrl}
                      onChange={(e) => setHeroBgImageUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Background image for the header section of the page.</p>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Hero Triangle Image URL (Optional)</label>
                    <input
                      className={inputClass}
                      placeholder="https://example.com/triangle-image.jpg"
                      value={heroTriangleImageUrl}
                      onChange={(e) => setHeroTriangleImageUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Triangle-shaped overlay image for the right side of the hero section.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Hero Title Background Color</label>
                      <select
                        className={selectClass}
                        value={heroTitleBgColor}
                        onChange={(e) => setHeroTitleBgColor(e.target.value)}
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
                        value={heroTitleTextColor}
                        onChange={(e) => setHeroTitleTextColor(e.target.value)}
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
                      value={heroSubtitleTextColor}
                      onChange={(e) => setHeroSubtitleTextColor(e.target.value)}
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
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Twitter URL</label>
                      <input
                        className={inputClass}
                        placeholder="https://twitter.com/wrf"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Instagram URL</label>
                      <input
                        className={inputClass}
                        placeholder="https://instagram.com/wrf"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>LinkedIn URL</label>
                      <input
                        className={inputClass}
                        placeholder="https://linkedin.com/company/wrf"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
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
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                    />
                  </div>
                  <div className={gridClass}>
                    <div className="space-y-2">
                      <label className={labelClass}>Quote Author Name</label>
                      <input
                        className={inputClass}
                        placeholder="Author Name"
                        value={quoteAuthorName}
                        onChange={(e) => setQuoteAuthorName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Quote Author Title</label>
                      <input
                        className={inputClass}
                        placeholder="CEO, Founder, etc."
                        value={quoteAuthorTitle}
                        onChange={(e) => setQuoteAuthorTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Quote Author Image URL</label>
                    <input
                      className={inputClass}
                      placeholder="https://example.com/author-photo.jpg"
                      value={quoteAuthorImageUrl}
                      onChange={(e) => setQuoteAuthorImageUrl(e.target.value)}
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
                          value={ogShareTitle}
                          onChange={(e) => setOgShareTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Share Image</label>
                        <input
                          className={inputClass}
                          placeholder="https://example.com/share-image.jpg"
                          value={ogShareImage}
                          onChange={(e) => setOgShareImage(e.target.value)}
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
                        value={ogShareDescription}
                        onChange={(e) => setOgShareDescription(e.target.value)}
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
                          value={twitterTitle}
                          onChange={(e) => setTwitterTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Twitter Image</label>
                        <input
                          className={inputClass}
                          placeholder="https://example.com/twitter-image.jpg"
                          value={twitterImage}
                          onChange={(e) => setTwitterImage(e.target.value)}
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
                        value={twitterDescription}
                        onChange={(e) => setTwitterDescription(e.target.value)}
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
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Appears in browser tabs and search results. Keep under 60 characters.</p>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Meta Description</label>
                    <textarea
                      className={textareaClass}
                      placeholder="Brief description for search engines"
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
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
