'use client';

import { useState, useEffect } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData, uploadAdminImage } from '@/lib/adminApi';

const TITLE_BG_OPTIONS = [
  { value: 'bg-wrf-black', label: 'Black (design default)' },
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
  titleBackgroundColor: 'bg-wrf-black',
  titleTextColor: 'text-white',
  subtitleTextColor: 'text-white/90',
};

const defaultOtherWays = {
  otherWaysTitle: 'Other Ways to Give',
  otherWaysDescription:
    "Beyond online donations, there are many meaningful ways to support our mission and create lasting impact.",
};

export default function DonationManagementPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'content' | 'bankwire'>('hero');
  const [pageTitle, setPageTitle] = useState(defaultHero.pageTitle);
  const [subtitle, setSubtitle] = useState(defaultHero.subtitle);
  const [heroBackgroundImageUrl, setHeroBackgroundImageUrl] = useState(defaultHero.heroBackgroundImageUrl);
  const [heroTriangleImageUrl, setHeroTriangleImageUrl] = useState(defaultHero.heroTriangleImageUrl);
  const [titleBackgroundColor, setTitleBackgroundColor] = useState(defaultHero.titleBackgroundColor);
  const [titleTextColor, setTitleTextColor] = useState(defaultHero.titleTextColor);
  const [subtitleTextColor, setSubtitleTextColor] = useState(defaultHero.subtitleTextColor);

  const [otherWaysTitle, setOtherWaysTitle] = useState(defaultOtherWays.otherWaysTitle);
  const [otherWaysDescription, setOtherWaysDescription] = useState(defaultOtherWays.otherWaysDescription);

  const [showBankDetails, setShowBankDetails] = useState(true);
  const [showDonationInquiryForm, setShowDonationInquiryForm] = useState(true);

  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [saveOtherWaysStatus, setSaveOtherWaysStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [saveBankWireStatus, setSaveBankWireStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [uploadingField, setUploadingField] = useState<'hero' | 'triangle' | null>(null);

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
      if (data.otherWaysTitle !== undefined) setOtherWaysTitle(data.otherWaysTitle);
      if (data.otherWaysDescription !== undefined) setOtherWaysDescription(data.otherWaysDescription);
      if (data.showBankDetails !== undefined) setShowBankDetails(data.showBankDetails);
      if (data.showDonationInquiryForm !== undefined) setShowDonationInquiryForm(data.showDonationInquiryForm);
    });
  }, []);

  const getAllData = () => ({
    pageTitle, subtitle,
    heroBackgroundImageUrl, heroTriangleImageUrl,
    titleBackgroundColor, titleTextColor, subtitleTextColor,
    otherWaysTitle, otherWaysDescription,
    showBankDetails, showDonationInquiryForm,
  });

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    const ok = await saveAdminData('donations', getAllData());
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleSaveOtherWays = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveOtherWaysStatus('saving');
    const ok = await saveAdminData('donations', getAllData());
    setSaveOtherWaysStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveOtherWaysStatus('idle'), 3000);
  };

  const handleSaveBankWire = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveBankWireStatus('saving');
    const ok = await saveAdminData('donations', getAllData());
    setSaveBankWireStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveBankWireStatus('idle'), 3000);
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
            className="h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 grid w-full grid-cols-3"
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
              aria-selected={activeTab === 'bankwire'}
              aria-controls="donation-tabpanel-bankwire"
              id="donation-tab-bankwire"
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === 'bankwire' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
              onClick={() => setActiveTab('bankwire')}
            >
              Bank Wire Transfer
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
                    <label className={labelClass}>Hero Background Image</label>
                    <p className="text-xs text-gray-500 mb-2">Use a path like /images/hero_background.jpeg or upload a file.</p>
                    <div className="flex gap-2 flex-wrap items-start">
                      <input
                        type="text"
                        className={`${inputClass} flex-1 min-w-[200px]`}
                        placeholder="/images/hero_background.jpeg"
                        value={heroBackgroundImageUrl}
                        onChange={(e) => setHeroBackgroundImageUrl(e.target.value)}
                      />
                      <label className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 py-2 border border-input bg-background hover:bg-gray-50 cursor-pointer disabled:opacity-50">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="sr-only"
                          disabled={uploadingField !== null}
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            setUploadingField('hero');
                            const url = await uploadAdminImage(f);
                            if (url) setHeroBackgroundImageUrl(url);
                            setUploadingField(null);
                            e.target.value = '';
                          }}
                        />
                        {uploadingField === 'hero' ? 'Uploading…' : 'Upload image'}
                      </label>
                    </div>
                    {heroBackgroundImageUrl && (
                      <div className="mt-2 rounded border overflow-hidden bg-gray-100 inline-block max-w-[280px]">
                        <img src={heroBackgroundImageUrl} alt="Hero background preview" className="max-h-32 w-auto object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Hero Triangle Image (diagonal area)</label>
                    <p className="text-xs text-gray-500 mb-2">Path like /images/hero_background.jpeg or same as background. Optional.</p>
                    <div className="flex gap-2 flex-wrap items-start">
                      <input
                        type="text"
                        className={`${inputClass} flex-1 min-w-[200px]`}
                        placeholder="/images/hero_background.jpeg"
                        value={heroTriangleImageUrl}
                        onChange={(e) => setHeroTriangleImageUrl(e.target.value)}
                      />
                      <label className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 py-2 border border-input bg-background hover:bg-gray-50 cursor-pointer disabled:opacity-50">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="sr-only"
                          disabled={uploadingField !== null}
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            setUploadingField('triangle');
                            const url = await uploadAdminImage(f);
                            if (url) setHeroTriangleImageUrl(url);
                            setUploadingField(null);
                            e.target.value = '';
                          }}
                        />
                        {uploadingField === 'triangle' ? 'Uploading…' : 'Upload image'}
                      </label>
                    </div>
                    {heroTriangleImageUrl && (
                      <div className="mt-2 rounded border overflow-hidden bg-gray-100 inline-block max-w-[280px]">
                        <img src={heroTriangleImageUrl} alt="Triangle area preview" className="max-h-32 w-auto object-cover" />
                      </div>
                    )}
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

          {/* Bank Wire Transfer tab panel */}
          <div
            role="tabpanel"
            id="donation-tabpanel-bankwire"
            aria-labelledby="donation-tab-bankwire"
            tabIndex={0}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            hidden={activeTab !== 'bankwire'}
          >
            <div className={cardClass}>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Bank Wire Transfer Settings</h3>
                <p className="text-sm text-gray-500">
                  Control the visibility of the bank wire transfer details and the donation inquiry form on the public Donate page.
                </p>
              </div>
              <div className="p-6 pt-0">
                <form onSubmit={handleSaveBankWire} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Show Bank Account &amp; Bank Details</p>
                        <p className="text-sm text-gray-500">When enabled, the Account Details and Bank Details cards are visible on the Donate page.</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={showBankDetails}
                        onClick={() => setShowBankDetails(!showBankDetails)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          showBankDetails ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showBankDetails ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Show Donation Inquiry Form</p>
                        <p className="text-sm text-gray-500">When enabled, a form asking for name, email, phone and organization is shown so your team can follow up with potential donors.</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={showDonationInquiryForm}
                        onClick={() => setShowDonationInquiryForm(!showDonationInquiryForm)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          showDonationInquiryForm ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showDonationInquiryForm ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <button type="submit" className={btnPrimary}>
                    Save Bank Wire Settings
                  </button>
                  {saveBankWireStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
                  {saveBankWireStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
                  {saveBankWireStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
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
                  Configure the section title and intro text shown on the donation page.
                </p>
              </div>
              <div className="p-6 pt-0">
                <form onSubmit={handleSaveOtherWays} className="space-y-4">
                  <div>
                    <label className={labelClass}>Section Title</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Other Ways to Give"
                      value={otherWaysTitle}
                      onChange={(e) => setOtherWaysTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Section Description</label>
                    <textarea
                      className={textareaClass}
                      placeholder="Beyond online donations, there are many meaningful ways..."
                      rows={4}
                      value={otherWaysDescription}
                      onChange={(e) => setOtherWaysDescription(e.target.value)}
                    />
                  </div>
                  <button type="submit" className={btnPrimary}>
                    Save Other Ways to Give
                  </button>
                  {saveOtherWaysStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
                  {saveOtherWaysStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
                  {saveOtherWaysStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
