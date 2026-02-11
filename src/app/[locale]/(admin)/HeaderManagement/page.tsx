'use client';

import { useState, useEffect } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const SvgLayoutTemplate = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="7" x="3" y="3" rx="1" />
    <rect width="9" height="7" x="3" y="14" rx="1" />
    <rect width="5" height="7" x="16" y="14" rx="1" />
  </svg>
);

const SvgSearch = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const SvgMenu = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const SvgSave = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
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

const SvgChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SEARCH_COLOR_OPTIONS = [
  { value: 'secondary', label: 'Secondary (Purple)' },
  { value: 'primary', label: 'Primary' },
  { value: 'accent', label: 'Accent' },
];

const COLUMN_COLOR_OPTIONS = [
  { value: 'secondary', label: 'Secondary Color (Purple)' },
  { value: 'accent', label: 'Accent Color (Pink)' },
  { value: 'support', label: 'Support Color (Rose)' },
  { value: 'white', label: 'White' },
];

type NavLink = { text: string; path: string };
type MegaMenuLink = { name: string; path: string };
type MegaMenuColumn = {
  title: string;
  color: string;
  links: MegaMenuLink[];
};

const defaultNavLinks: NavLink[] = [
  { text: 'WRF', path: 'About' },
  { text: ' News and updates', path: 'News' },
  { text: 'Vacancies', path: 'Vacancies' },
  { text: '', path: '' },
];

const defaultMegaColumns: MegaMenuColumn[] = [
  {
    title: "Women's Rights First",
    color: 'secondary',
    links: [
      { name: 'Founders', path: 'Founders' },
      { name: 'Team', path: 'Team' },
      { name: 'About us', path: 'About' },
    ],
  },
  {
    title: 'What we do',
    color: 'accent',
    links: [
      { name: 'Legal Empowerment and International Accountability', path: 'ProgramPage?slug=legal-empowerment-international-accountability' },
      { name: 'Peace Building', path: 'ProgramPage?slug=peacebuilding-social-cohesion' },
      { name: 'Digital Transformation and Open Gender Data', path: 'ProgramPage?slug=Digital-Transformation-and%20-Open%20-Gender%20-Data' },
      { name: 'Representation and Advocacy', path: 'ProgramPage?slug=representation-advocacy' },
    ],
  },
  {
    title: 'Information',
    color: 'support',
    links: [
      { name: 'Questions and answers', path: 'FAQ' },
      { name: 'News and events', path: 'News' },
      { name: 'Careers and vacancies', path: 'Vacancies' },
      { name: 'Privacy policy ', path: 'PrivacyPolicy' },
    ],
  },
  {
    title: 'Get involved',
    color: 'white',
    links: [
      { name: 'Become a partner', path: 'Partnership' },
      { name: 'Become a volunteer', path: 'Volunteer' },
      { name: 'Contact us', path: 'contact' },
    ],
  },
];

export default function HeaderManagementPage() {
  const [logoUrl, setLogoUrl] = useState('/logo.jpg');
  const [donationButtonText, setDonationButtonText] = useState('Donate Now');
  const [donationButtonLink, setDonationButtonLink] = useState('Donate');
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search...');
  const [searchButtonColor, setSearchButtonColor] = useState('secondary');
  const [navLinks, setNavLinks] = useState<NavLink[]>(defaultNavLinks);
  const [megaColumns, setMegaColumns] = useState<MegaMenuColumn[]>(defaultMegaColumns);
  const [megaFooterText, setMegaFooterText] = useState('Ready to make a difference? ');
  const [megaFooterBtn1Text, setMegaFooterBtn1Text] = useState('Donate');
  const [megaFooterBtn1Link, setMegaFooterBtn1Link] = useState('Donate');
  const [megaFooterBtn2Text, setMegaFooterBtn2Text] = useState('Get In Touch');
  const [megaFooterBtn2Link, setMegaFooterBtn2Link] = useState('Contact');
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    loadAdminData<Record<string, any>>('header').then(data => {
      if (!data) return;
      if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
      if (data.donationButtonText !== undefined) setDonationButtonText(data.donationButtonText);
      if (data.donationButtonLink !== undefined) setDonationButtonLink(data.donationButtonLink);
      if (data.searchPlaceholder !== undefined) setSearchPlaceholder(data.searchPlaceholder);
      if (data.searchButtonColor !== undefined) setSearchButtonColor(data.searchButtonColor);
      if (data.navLinks !== undefined) setNavLinks(data.navLinks);
      if (data.megaColumns !== undefined) setMegaColumns(data.megaColumns);
      if (data.megaFooterText !== undefined) setMegaFooterText(data.megaFooterText);
      if (data.megaFooterBtn1Text !== undefined) setMegaFooterBtn1Text(data.megaFooterBtn1Text);
      if (data.megaFooterBtn1Link !== undefined) setMegaFooterBtn1Link(data.megaFooterBtn1Link);
      if (data.megaFooterBtn2Text !== undefined) setMegaFooterBtn2Text(data.megaFooterBtn2Text);
      if (data.megaFooterBtn2Link !== undefined) setMegaFooterBtn2Link(data.megaFooterBtn2Link);
    });
  }, []);

  const updateNavLink = (index: number, field: 'text' | 'path', value: string) => {
    setNavLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addNavLink = () => setNavLinks((prev) => [...prev, { text: '', path: '' }]);
  const removeNavLink = (index: number) => setNavLinks((prev) => prev.filter((_, i) => i !== index));

  const addMegaColumn = () =>
    setMegaColumns((prev) => [...prev, { title: '', color: 'secondary', links: [] }]);
  const removeMegaColumn = (index: number) =>
    setMegaColumns((prev) => prev.filter((_, i) => i !== index));

  const updateMegaColumn = (colIndex: number, field: 'title' | 'color', value: string) => {
    setMegaColumns((prev) => {
      const next = [...prev];
      next[colIndex] = { ...next[colIndex], [field]: value };
      return next;
    });
  };

  const addMegaLink = (colIndex: number) => {
    setMegaColumns((prev) => {
      const next = [...prev];
      next[colIndex] = { ...next[colIndex], links: [...next[colIndex].links, { name: '', path: '' }] };
      return next;
    });
  };

  const updateMegaLink = (colIndex: number, linkIndex: number, field: 'name' | 'path', value: string) => {
    setMegaColumns((prev) => {
      const next = [...prev];
      const links = [...next[colIndex].links];
      links[linkIndex] = { ...links[linkIndex], [field]: value };
      next[colIndex] = { ...next[colIndex], links };
      return next;
    });
  };

  const removeMegaLink = (colIndex: number, linkIndex: number) => {
    setMegaColumns((prev) => {
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
      logoUrl, donationButtonText, donationButtonLink,
      searchPlaceholder, searchButtonColor, navLinks, megaColumns,
      megaFooterText, megaFooterBtn1Text, megaFooterBtn1Link,
      megaFooterBtn2Text, megaFooterBtn2Link,
    };
    const ok = await saveAdminData('header', data);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
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
            <h1 className="text-3xl font-heading font-bold text-primary">Header Settings</h1>
            <p className="text-gray-600 font-body">Customize the entire website header and navigation.</p>
          </div>
          <button type="button" onClick={handleSaveAll} className={btnPrimary}>
            <SvgSave className="w-4 h-4 mr-2" />
            Save All Settings
          </button>
          {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
          {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
        </div>

        {/* Logo & General */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading flex items-center gap-2">
              <SvgLayoutTemplate className="w-5 h-5" />
              Logo & General
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className={labelClass}>Logo URL</label>
              <input
                type="url"
                className={inputClass}
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">Recommended size: 300x80 pixels for best readability</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Donation Button Text</label>
                <input
                  type="text"
                  className={inputClass}
                  value={donationButtonText}
                  onChange={(e) => setDonationButtonText(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Donation Button Link</label>
                <input
                  type="text"
                  className={inputClass}
                  value={donationButtonLink}
                  onChange={(e) => setDonationButtonLink(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Settings */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading flex items-center gap-2">
              <SvgSearch className="w-5 h-5" />
              Search Settings
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Search Placeholder Text</label>
                <input
                  type="text"
                  className={inputClass}
                  value={searchPlaceholder}
                  onChange={(e) => setSearchPlaceholder(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Search Button Color</label>
                <select
                  className={inputClass}
                  value={searchButtonColor}
                  onChange={(e) => setSearchButtonColor(e.target.value)}
                >
                  {SEARCH_COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading">Main Navigation Links</h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {navLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Link Text</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="ABOUT US"
                    value={link.text}
                    onChange={(e) => updateNavLink(index, 'text', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Link Path</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="About"
                    value={link.path}
                    onChange={(e) => updateNavLink(index, 'path', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mega Menu Columns */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading flex items-center gap-2">
                <SvgMenu className="w-5 h-5" />
                Mega Menu Columns
              </h3>
              <button type="button" onClick={addMegaColumn} className={btnSecondary}>
                <SvgPlus className="w-4 h-4 mr-2" />
                Add Column
              </button>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-6">
            {megaColumns.map((col, colIndex) => (
              <div key={colIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Column {colIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeMegaColumn(colIndex)}
                    className={btnDanger}
                  >
                    <SvgTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Column Title</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="COLUMN TITLE"
                      value={col.title}
                      onChange={(e) => updateMegaColumn(colIndex, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Column Color</label>
                    <select
                      className={inputClass}
                      value={col.color}
                      onChange={(e) => updateMegaColumn(colIndex, 'color', e.target.value)}
                    >
                      {COLUMN_COLOR_OPTIONS.map((opt) => (
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
                    <button
                      type="button"
                      onClick={() => addMegaLink(colIndex)}
                      className={btnSecondary}
                    >
                      <SvgPlus className="w-4 h-4 mr-1" />
                      Add Link
                    </button>
                  </div>
                  {col.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="grid grid-cols-3 gap-2 items-end">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Link Name"
                        value={link.name}
                        onChange={(e) => updateMegaLink(colIndex, linkIndex, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Path"
                        value={link.path}
                        onChange={(e) => updateMegaLink(colIndex, linkIndex, 'path', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeMegaLink(colIndex, linkIndex)}
                        className={btnDanger}
                      >
                        <SvgTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mega Menu Footer */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading">Mega Menu Footer</h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className={labelClass}>Footer Text</label>
              <input
                type="text"
                className={inputClass}
                value={megaFooterText}
                onChange={(e) => setMegaFooterText(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Button 1 Text</label>
                <input
                  type="text"
                  className={inputClass}
                  value={megaFooterBtn1Text}
                  onChange={(e) => setMegaFooterBtn1Text(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Button 1 Link</label>
                <input
                  type="text"
                  className={inputClass}
                  value={megaFooterBtn1Link}
                  onChange={(e) => setMegaFooterBtn1Link(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Button 2 Text</label>
                <input
                  type="text"
                  className={inputClass}
                  value={megaFooterBtn2Text}
                  onChange={(e) => setMegaFooterBtn2Text(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Button 2 Link</label>
                <input
                  type="text"
                  className={inputClass}
                  value={megaFooterBtn2Link}
                  onChange={(e) => setMegaFooterBtn2Link(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
