'use client';

import { useState, useEffect } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const SvgSave = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
  </svg>
);

const SvgUsers = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SvgMail = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SvgPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const SvgTrash2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const SvgMapPin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SvgLink = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const SvgChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SOCIAL_ICON_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const COLUMN_BG_OPTIONS = [
  { value: 'secondary', label: 'Secondary (Purple)' },
  { value: 'accent', label: 'Accent (Pink)' },
  { value: 'support', label: 'Support (Rose)' },
];

const COLUMN_TEXT_OPTIONS = [
  { value: 'white', label: 'White' },
  { value: 'primary', label: 'Primary' },
];

type SocialLink = { platform: string; url: string; icon: string };
type FooterLink = { text: string; url: string };
type LinkColumn = {
  title: string;
  backgroundColor: string;
  textColor: string;
  links: FooterLink[];
};

const defaultSocialLinks: SocialLink[] = [
  { platform: 'facebook', url: '#', icon: 'facebook' },
  { platform: 'twitter', url: 'https://x.com/women_s24642', icon: 'twitter' },
  { platform: 'instagram', url: 'https://www.instagram.com/womensrightsfirst/', icon: 'instagram' },
  { platform: 'linkedin', url: "http://linkedin.com/in/women's-rights-first-wrf-870226381", icon: 'linkedin' },
];

const defaultLinkColumns: LinkColumn[] = [
  {
    title: 'WRF & Information',
    backgroundColor: 'secondary',
    textColor: 'white',
    links: [
      { text: 'Our team', url: 'our_team' },
      { text: 'Board of Directors', url: 'board_of_Directors' },
      { text: 'About WRF', url: 'About' },
      { text: 'Questions & Answers', url: 'FAQ' },
      { text: 'News & Events', url: 'News' },
      { text: 'Careers & vacancies', url: 'Vacancies' },
    ],
  },
  {
    title: ' What we do',
    backgroundColor: 'accent',
    textColor: 'white',
    links: [
      { text: 'Legal Empowerment & International Accountability', url: 'ProgramPage?slug=legal-empowerment-international-accountability' },
      { text: 'Peace building ', url: 'ProgramPage?slug=peacebuilding-social-cohesion' },
      { text: 'Digital transformation and open gender data ', url: 'ProgramPage?slug=Digital-Transformation-and%20-Open%20-Gender%20-Data' },
      { text: 'Representation and Advocacy', url: 'ProgramPage?slug=representation-advocacy' },
    ],
  },
  {
    title: 'Get Involved',
    backgroundColor: 'support',
    textColor: 'white',
    links: [
      { text: 'Volunteer', url: 'Volunteer' },
      { text: 'Donate', url: 'Donate' },
      { text: 'Partnership', url: 'Partnership' },
      { text: 'Contact us', url: 'Contact' },
    ],
  },
];

export default function FooterManagementPage() {
  const [subscriberCount] = useState(4);
  const [newsletterTitle, setNewsletterTitle] = useState('Contact us');
  const [newsletterPlaceholder, setNewsletterPlaceholder] = useState('Enter your email');
  const [newsletterSubtitle, setNewsletterSubtitle] = useState('Get the latest news about our programs and impact');
  const [socialTitle, setSocialTitle] = useState('Follow us on social media');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [addressTitle, setAddressTitle] = useState('Where we are');
  const [addressContent, setAddressContent] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [linkColumns, setLinkColumns] = useState<LinkColumn[]>(defaultLinkColumns);
  const [copyrightText, setCopyrightText] = useState("© 2025 Women's Rights First WRF. All rights reserved.");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState('PrivacyPolicy');
  const [termsOfServiceUrl, setTermsOfServiceUrl] = useState('#');
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    loadAdminData<Record<string, any>>('footer').then(data => {
      if (!data) return;
      if (data.newsletterTitle !== undefined) setNewsletterTitle(data.newsletterTitle);
      if (data.newsletterPlaceholder !== undefined) setNewsletterPlaceholder(data.newsletterPlaceholder);
      if (data.newsletterSubtitle !== undefined) setNewsletterSubtitle(data.newsletterSubtitle);
      if (data.socialTitle !== undefined) setSocialTitle(data.socialTitle);
      if (data.socialLinks !== undefined) setSocialLinks(data.socialLinks);
      if (data.addressTitle !== undefined) setAddressTitle(data.addressTitle);
      if (data.addressContent !== undefined) setAddressContent(data.addressContent);
      if (data.phoneNumber !== undefined) setPhoneNumber(data.phoneNumber);
      if (data.whatsappNumber !== undefined) setWhatsappNumber(data.whatsappNumber);
      if (data.linkColumns !== undefined) setLinkColumns(data.linkColumns);
      if (data.copyrightText !== undefined) setCopyrightText(data.copyrightText);
      if (data.privacyPolicyUrl !== undefined) setPrivacyPolicyUrl(data.privacyPolicyUrl);
      if (data.termsOfServiceUrl !== undefined) setTermsOfServiceUrl(data.termsOfServiceUrl);
    });
  }, []);

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setSocialLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addSocialLink = () =>
    setSocialLinks((prev) => [...prev, { platform: '', url: '', icon: 'facebook' }]);
  const removeSocialLink = (index: number) =>
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));

  const updateLinkColumn = (colIndex: number, field: 'title' | 'backgroundColor' | 'textColor', value: string) => {
    setLinkColumns((prev) => {
      const next = [...prev];
      next[colIndex] = { ...next[colIndex], [field]: value };
      return next;
    });
  };

  const addColumnLink = (colIndex: number) => {
    setLinkColumns((prev) => {
      const next = [...prev];
      next[colIndex] = { ...next[colIndex], links: [...next[colIndex].links, { text: '', url: '' }] };
      return next;
    });
  };

  const updateColumnLink = (colIndex: number, linkIndex: number, field: 'text' | 'url', value: string) => {
    setLinkColumns((prev) => {
      const next = [...prev];
      const links = [...next[colIndex].links];
      links[linkIndex] = { ...links[linkIndex], [field]: value };
      next[colIndex] = { ...next[colIndex], links };
      return next;
    });
  };

  const removeColumnLink = (colIndex: number, linkIndex: number) => {
    setLinkColumns((prev) => {
      const next = [...prev];
      next[colIndex] = {
        ...next[colIndex],
        links: next[colIndex].links.filter((_, i) => i !== linkIndex),
      };
      return next;
    });
  };

  const handleSaveAll = async () => {
    setSaveStatus('saving');
    const data = {
      newsletterTitle, newsletterPlaceholder, newsletterSubtitle,
      socialTitle, socialLinks, addressTitle, addressContent,
      phoneNumber, whatsappNumber, linkColumns,
      copyrightText, privacyPolicyUrl, termsOfServiceUrl,
    };
    const ok = await saveAdminData('footer', data);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
  const textareaClass =
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const cardClass = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const btnPrimary =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 px-3 py-2 bg-secondary hover:bg-secondary/90';
  const btnSecondary =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3';
  const btnDanger = btnSecondary + ' text-red-600';

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Footer Management</h1>
            <p className="text-gray-600 font-body">Customize your website footer and manage newsletter subscribers.</p>
          </div>
          <button type="button" onClick={handleSaveAll} className={btnPrimary}>
            <SvgSave className="w-4 h-4 mr-2" />
            Save All Settings
          </button>
          {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
          {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
        </div>

        {/* Newsletter Subscribers */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading flex items-center gap-2">
              <SvgUsers className="w-5 h-5" />
              Newsletter Subscribers ({subscriberCount})
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-sm text-gray-600 font-body">Active subscribers: {subscriberCount}</div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading flex items-center gap-2">
              <SvgMail className="w-5 h-5" />
              Newsletter Section
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Newsletter Title</label>
                <input
                  type="text"
                  className={inputClass}
                  value={newsletterTitle}
                  onChange={(e) => setNewsletterTitle(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Email Placeholder</label>
                <input
                  type="text"
                  className={inputClass}
                  value={newsletterPlaceholder}
                  onChange={(e) => setNewsletterPlaceholder(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Newsletter Subtitle</label>
              <input
                type="text"
                className={inputClass}
                value={newsletterSubtitle}
                onChange={(e) => setNewsletterSubtitle(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading">Social Media Links</h3>
              <button type="button" onClick={addSocialLink} className={btnSecondary}>
                <SvgPlus className="w-4 h-4 mr-2" />
                Add Social Link
              </button>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className={labelClass}>Social Media Title</label>
              <input
                type="text"
                className={inputClass}
                value={socialTitle}
                onChange={(e) => setSocialTitle(e.target.value)}
              />
            </div>
            {socialLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <label className={labelClass}>Platform</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>URL</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Icon</label>
                  <select
                    className={inputClass}
                    value={link.icon}
                    onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                  >
                    {SOCIAL_ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => removeSocialLink(index)} className={btnDanger}>
                  <SvgTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Address Section */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading flex items-center gap-2">
              <SvgMapPin className="w-5 h-5" />
              Address Section
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className={labelClass}>Address Title</label>
              <input
                type="text"
                className={inputClass}
                value={addressTitle}
                onChange={(e) => setAddressTitle(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Address Content</label>
              <textarea
                className={textareaClass}
                rows={5}
                placeholder="Full address with contact details"
                value={addressContent}
                onChange={(e) => setAddressContent(e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="+1 (555) 123-4567"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Link Columns */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading flex items-center gap-2">
              <SvgLink className="w-5 h-5" />
              Link Columns
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-6">
            {linkColumns.map((col, colIndex) => (
              <div key={colIndex} className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-4">Column {colIndex + 1}</h4>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Column Title</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={col.title}
                      onChange={(e) => updateLinkColumn(colIndex, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Background Color</label>
                    <select
                      className={inputClass}
                      value={col.backgroundColor}
                      onChange={(e) => updateLinkColumn(colIndex, 'backgroundColor', e.target.value)}
                    >
                      {COLUMN_BG_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Text Color</label>
                    <select
                      className={inputClass}
                      value={col.textColor}
                      onChange={(e) => updateLinkColumn(colIndex, 'textColor', e.target.value)}
                    >
                      {COLUMN_TEXT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className={labelClass}>Links in Column</label>
                    <button type="button" onClick={() => addColumnLink(colIndex)} className={btnSecondary}>
                      <SvgPlus className="w-4 h-4 mr-1" />
                      Add Link
                    </button>
                  </div>
                  {col.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="grid grid-cols-3 gap-2 items-end">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Link Text"
                        value={link.text}
                        onChange={(e) => updateColumnLink(colIndex, linkIndex, 'text', e.target.value)}
                      />
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="URL or Page"
                        value={link.url}
                        onChange={(e) => updateColumnLink(colIndex, linkIndex, 'url', e.target.value)}
                      />
                      <button type="button" onClick={() => removeColumnLink(colIndex, linkIndex)} className={btnDanger}>
                        <SvgTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading">Copyright & Legal</h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className={labelClass}>Copyright Text</label>
              <input
                type="text"
                className={inputClass}
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Privacy Policy URL</label>
                <input
                  type="text"
                  className={inputClass}
                  value={privacyPolicyUrl}
                  onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Terms of Service URL</label>
                <input
                  type="text"
                  className={inputClass}
                  value={termsOfServiceUrl}
                  onChange={(e) => setTermsOfServiceUrl(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
