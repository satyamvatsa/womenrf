'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const COLOR_OPTIONS = [
  { value: 'bg-primary', label: 'Primary (Dark)' },
  { value: 'bg-secondary', label: 'Secondary (Purple)' },
  { value: 'bg-accent', label: 'Accent (Pink)' },
  { value: 'bg-support-1', label: 'Support (Rose)' },
];

function ToggleRow({
  id,
  label,
  checked,
  onChange,
  showIcon = true,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  showIcon?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-md">
      <label htmlFor={id} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {showIcon &&
          (checked ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-600">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-500">
              <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
              <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
              <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
              <path d="m2 2 20 20" />
            </svg>
          ))}
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${checked ? 'bg-primary text-primary-foreground' : ''}`}
          id={id}
        >
          {checked && (
            <span className="flex items-center justify-center text-current">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function SaveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save w-4 h-4 mr-2">
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

export default function HomepageManagementPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const base = `/${locale}`;

  const [showHero, setShowHero] = useState(true);
  const [heroTitle, setHeroTitle] = useState('Empowering Women, Transforming Lives');
  const [heroTitleBg, setHeroTitleBg] = useState('bg-secondary');
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Be part of our effort to ensure that every woman in Afghanistan enjoys her fundamental rights to equality, dignity, and self-determination."
  );
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroTriangleUrl, setHeroTriangleUrl] = useState('');
  const [heroButton1Text, setHeroButton1Text] = useState('Learn Our Story');
  const [heroButton1Link, setHeroButton1Link] = useState('About');
  const [heroButton1Color, setHeroButton1Color] = useState('bg-accent');
  const [heroButton2Text, setHeroButton2Text] = useState('Our Programs');
  const [heroButton2Link, setHeroButton2Link] = useState('Programs');
  const [heroButton2Color, setHeroButton2Color] = useState('bg-primary');

  const [showPagesShowcase, setShowPagesShowcase] = useState(true);
  const [pagesShowcaseTitle, setPagesShowcaseTitle] = useState('Explore Our Impact');
  const [pagesShowcaseTitleBg, setPagesShowcaseTitleBg] = useState('bg-primary');
  const [pagesShowcaseSubtitle, setPagesShowcaseSubtitle] = useState('Discover the many ways to connect with our mission and make a difference.');
  const [pagesShowcaseQuote, setPagesShowcaseQuote] = useState('Together, we can create a world where every woman has the opportunity to thrive and lead.');
  const [pagesShowcaseQuoteAuthor, setPagesShowcaseQuoteAuthor] = useState('');
  const [pagesShowcaseQuoteAuthorTitle, setPagesShowcaseQuoteAuthorTitle] = useState('');
  const [pagesShowcaseQuoteAuthorImage, setPagesShowcaseQuoteAuthorImage] = useState('');
  const [pagesShowcaseQuoteBg, setPagesShowcaseQuoteBg] = useState('bg-accent');
  const [showcaseCards, setShowcaseCards] = useState<unknown[]>([]);

  const [showPrograms, setShowPrograms] = useState(true);
  const [programsTitle, setProgramsTitle] = useState('Our Impact Programs');
  const [programsTitleBg, setProgramsTitleBg] = useState('bg-secondary');
  const [programsSubtitle, setProgramsSubtitle] = useState('Transforming communities through targeted initiatives.');
  const [programsButtonColor, setProgramsButtonColor] = useState('bg-secondary');

  const [showTestimonials, setShowTestimonials] = useState(false);
  const [testimonialTitle, setTestimonialTitle] = useState('');
  const [testimonialTitleBg, setTestimonialTitleBg] = useState('bg-primary');
  const [testimonialSubtitle, setTestimonialSubtitle] = useState('');

  const [showVacancies, setShowVacancies] = useState(true);
  const [vacanciesTitle, setVacanciesTitle] = useState('Join Our Team');
  const [vacanciesTitleBg, setVacanciesTitleBg] = useState('bg-accent');
  const [vacanciesSubtitle, setVacanciesSubtitle] = useState("Make a difference in women's lives around the world. Explore our latest career opportunities.");
  const [vacanciesButtonColor, setVacanciesButtonColor] = useState('bg-primary');

  const [showNews, setShowNews] = useState(true);
  const [newsTitle, setNewsTitle] = useState('Latest Updates');
  const [newsTitleBg, setNewsTitleBg] = useState('bg-support-1');
  const [newsSubtitle, setNewsSubtitle] = useState('Stay informed about our news, events, and announcements.');
  const [newsButtonColor, setNewsButtonColor] = useState('bg-secondary');

  const [showPartners, setShowPartners] = useState(true);
  const [partnersTitle, setPartnersTitle] = useState('Our Partners & Collaborators');
  const [partnersTitleBg, setPartnersTitleBg] = useState('bg-primary');
  const [partnersSubtitle, setPartnersSubtitle] = useState('Working together to create lasting change');
  const [partnersList, setPartnersList] = useState<{ name: string; logoUrl: string; websiteUrl: string }[]>([
    { name: 'Google', logoUrl: 'https://logo.clearbit.com/google.com', websiteUrl: 'https://google.com' },
    { name: 'Microsoft', logoUrl: 'https://logo.clearbit.com/microsoft.com', websiteUrl: 'https://microsoft.com' },
    { name: 'Salesforce', logoUrl: 'https://logo.clearbit.com/salesforce.com', websiteUrl: 'https://salesforce.com' },
    { name: 'Amazon', logoUrl: 'https://logo.clearbit.com/amazon.com', websiteUrl: 'https://amazon.com' },
    { name: 'Shopify', logoUrl: 'https://logo.clearbit.com/shopify.com', websiteUrl: 'https://shopify.com' },
    { name: 'Netflix', logoUrl: 'https://logo.clearbit.com/netflix.com', websiteUrl: 'https://netflix.com' },
    { name: 'Meta', logoUrl: 'https://logo.clearbit.com/meta.com', websiteUrl: 'https://meta.com' },
    { name: 'Slack', logoUrl: 'https://logo.clearbit.com/slack.com', websiteUrl: 'https://slack.com' },
    { name: 'Asana', logoUrl: 'https://logo.clearbit.com/asana.com', websiteUrl: 'https://asana.com' },
    { name: 'Trello', logoUrl: 'https://logo.clearbit.com/trello.com', websiteUrl: 'https://trello.com' },
  ]);

  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    loadAdminData<Record<string, any>>('homepage').then(data => {
      if (!data) return;
      if (data.showHero !== undefined) setShowHero(data.showHero);
      if (data.heroTitle !== undefined) setHeroTitle(data.heroTitle);
      if (data.heroTitleBg !== undefined) setHeroTitleBg(data.heroTitleBg);
      if (data.heroSubtitle !== undefined) setHeroSubtitle(data.heroSubtitle);
      if (data.heroImageUrl !== undefined) setHeroImageUrl(data.heroImageUrl);
      if (data.heroTriangleUrl !== undefined) setHeroTriangleUrl(data.heroTriangleUrl);
      if (data.heroButton1Text !== undefined) setHeroButton1Text(data.heroButton1Text);
      if (data.heroButton1Link !== undefined) setHeroButton1Link(data.heroButton1Link);
      if (data.heroButton1Color !== undefined) setHeroButton1Color(data.heroButton1Color);
      if (data.heroButton2Text !== undefined) setHeroButton2Text(data.heroButton2Text);
      if (data.heroButton2Link !== undefined) setHeroButton2Link(data.heroButton2Link);
      if (data.heroButton2Color !== undefined) setHeroButton2Color(data.heroButton2Color);
      if (data.showPagesShowcase !== undefined) setShowPagesShowcase(data.showPagesShowcase);
      if (data.pagesShowcaseTitle !== undefined) setPagesShowcaseTitle(data.pagesShowcaseTitle);
      if (data.pagesShowcaseTitleBg !== undefined) setPagesShowcaseTitleBg(data.pagesShowcaseTitleBg);
      if (data.pagesShowcaseSubtitle !== undefined) setPagesShowcaseSubtitle(data.pagesShowcaseSubtitle);
      if (data.pagesShowcaseQuote !== undefined) setPagesShowcaseQuote(data.pagesShowcaseQuote);
      if (data.pagesShowcaseQuoteAuthor !== undefined) setPagesShowcaseQuoteAuthor(data.pagesShowcaseQuoteAuthor);
      if (data.pagesShowcaseQuoteAuthorTitle !== undefined) setPagesShowcaseQuoteAuthorTitle(data.pagesShowcaseQuoteAuthorTitle);
      if (data.pagesShowcaseQuoteAuthorImage !== undefined) setPagesShowcaseQuoteAuthorImage(data.pagesShowcaseQuoteAuthorImage);
      if (data.pagesShowcaseQuoteBg !== undefined) setPagesShowcaseQuoteBg(data.pagesShowcaseQuoteBg);
      if (data.showcaseCards !== undefined) setShowcaseCards(data.showcaseCards);
      if (data.showPrograms !== undefined) setShowPrograms(data.showPrograms);
      if (data.programsTitle !== undefined) setProgramsTitle(data.programsTitle);
      if (data.programsTitleBg !== undefined) setProgramsTitleBg(data.programsTitleBg);
      if (data.programsSubtitle !== undefined) setProgramsSubtitle(data.programsSubtitle);
      if (data.programsButtonColor !== undefined) setProgramsButtonColor(data.programsButtonColor);
      if (data.showTestimonials !== undefined) setShowTestimonials(data.showTestimonials);
      if (data.testimonialTitle !== undefined) setTestimonialTitle(data.testimonialTitle);
      if (data.testimonialTitleBg !== undefined) setTestimonialTitleBg(data.testimonialTitleBg);
      if (data.testimonialSubtitle !== undefined) setTestimonialSubtitle(data.testimonialSubtitle);
      if (data.showVacancies !== undefined) setShowVacancies(data.showVacancies);
      if (data.vacanciesTitle !== undefined) setVacanciesTitle(data.vacanciesTitle);
      if (data.vacanciesTitleBg !== undefined) setVacanciesTitleBg(data.vacanciesTitleBg);
      if (data.vacanciesSubtitle !== undefined) setVacanciesSubtitle(data.vacanciesSubtitle);
      if (data.vacanciesButtonColor !== undefined) setVacanciesButtonColor(data.vacanciesButtonColor);
      if (data.showNews !== undefined) setShowNews(data.showNews);
      if (data.newsTitle !== undefined) setNewsTitle(data.newsTitle);
      if (data.newsTitleBg !== undefined) setNewsTitleBg(data.newsTitleBg);
      if (data.newsSubtitle !== undefined) setNewsSubtitle(data.newsSubtitle);
      if (data.newsButtonColor !== undefined) setNewsButtonColor(data.newsButtonColor);
      if (data.showPartners !== undefined) setShowPartners(data.showPartners);
      if (data.partnersTitle !== undefined) setPartnersTitle(data.partnersTitle);
      if (data.partnersTitleBg !== undefined) setPartnersTitleBg(data.partnersTitleBg);
      if (data.partnersSubtitle !== undefined) setPartnersSubtitle(data.partnersSubtitle);
      if (data.partnersList !== undefined) setPartnersList(data.partnersList);
    });
  }, []);

  const addPartner = () => {
    setPartnersList((p) => [...p, { name: '', logoUrl: '', websiteUrl: '' }]);
  };
  const removePartner = (i: number) => {
    setPartnersList((p) => p.filter((_, idx) => idx !== i));
  };
  const updatePartner = (i: number, field: 'name' | 'logoUrl' | 'websiteUrl', value: string) => {
    setPartnersList((p) => p.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  };

  const addShowcaseCard = () => {
    setShowcaseCards((c) => [...c, {}]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    const data = {
      showHero, heroTitle, heroTitleBg, heroSubtitle, heroImageUrl, heroTriangleUrl,
      heroButton1Text, heroButton1Link, heroButton1Color,
      heroButton2Text, heroButton2Link, heroButton2Color,
      showPagesShowcase, pagesShowcaseTitle, pagesShowcaseTitleBg, pagesShowcaseSubtitle,
      pagesShowcaseQuote, pagesShowcaseQuoteAuthor, pagesShowcaseQuoteAuthorTitle,
      pagesShowcaseQuoteAuthorImage, pagesShowcaseQuoteBg, showcaseCards,
      showPrograms, programsTitle, programsTitleBg, programsSubtitle, programsButtonColor,
      showTestimonials, testimonialTitle, testimonialTitleBg, testimonialSubtitle,
      showVacancies, vacanciesTitle, vacanciesTitleBg, vacanciesSubtitle, vacanciesButtonColor,
      showNews, newsTitle, newsTitleBg, newsSubtitle, newsButtonColor,
      showPartners, partnersTitle, partnersTitleBg, partnersSubtitle, partnersList,
    };
    const ok = await saveAdminData('homepage', data);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
  const textareaClass =
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const selectClass =
    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring';
  const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const cardHeaderClass = 'flex flex-col space-y-1.5 p-6';
  const cardTitleClass = 'text-2xl font-semibold leading-none tracking-tight';
  const cardDescClass = 'text-sm text-muted-foreground';
  const sectionClass = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const gridClass = 'grid md:grid-cols-2 gap-4';
  const spaceYClass = 'p-6 pt-0 space-y-4';

  return (
    <AdminShell>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Homepage Settings</h1>
            <p className="text-gray-600 font-body mt-1">Control the content, colors, and visibility of all sections on your homepage.</p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2"
          >
            <SaveIcon />
            Save Changes
          </button>
          {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
          {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
        </div>

        {/* Hero Section */}
        <div className={sectionClass}>
          <div className={cardHeaderClass}>
            <h3 className={cardTitleClass}>Hero Section</h3>
            <p className={cardDescClass}>The main banner at the top of your homepage.</p>
          </div>
          <div className={spaceYClass}>
            <ToggleRow id="show_hero_section" label="Show Hero Section" checked={showHero} onChange={setShowHero} />
            <div className={gridClass}>
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass + ' mt-2'} name="hero_title" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Title & Subtitle Background Color</label>
                <select className={selectClass + ' mt-2'} value={heroTitleBg} onChange={(e) => setHeroTitleBg(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subtitle</label>
                <textarea className={textareaClass + ' mt-2'} name="hero_subtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Background Image URL</label>
                <input className={inputClass + ' mt-2'} name="hero_image_url" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} placeholder="/images/hero_background.jpeg" />
                <p className="text-xs text-gray-500 mt-1">Upload hero image to <code className="bg-gray-100 px-1">public/images/</code> and use e.g. <code className="bg-gray-100 px-1">/images/hero_background.jpeg</code></p>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Triangle Image URL (Right Side)</label>
                <input className={inputClass + ' mt-2'} name="hero_image_triangle_url" value={heroTriangleUrl} onChange={(e) => setHeroTriangleUrl(e.target.value)} placeholder="/images/hero_background.jpeg" />
              </div>
              <div>
                <label className={labelClass}>Button 1 Text</label>
                <input className={inputClass + ' mt-2'} name="hero_button1_text" value={heroButton1Text} onChange={(e) => setHeroButton1Text(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Button 1 Link</label>
                <input className={inputClass + ' mt-2'} name="hero_button1_link" value={heroButton1Link} onChange={(e) => setHeroButton1Link(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Button 1 Color</label>
                <select className={selectClass + ' mt-2'} value={heroButton1Color} onChange={(e) => setHeroButton1Color(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Button 2 Text</label>
                <input className={inputClass + ' mt-2'} name="hero_button2_text" value={heroButton2Text} onChange={(e) => setHeroButton2Text(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Button 2 Link</label>
                <input className={inputClass + ' mt-2'} name="hero_button2_link" value={heroButton2Link} onChange={(e) => setHeroButton2Link(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Button 2 Color</label>
                <select className={selectClass + ' mt-2'} value={heroButton2Color} onChange={(e) => setHeroButton2Color(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Page Showcase Section */}
        <div className={sectionClass}>
          <div className={cardHeaderClass}>
            <h3 className={cardTitleClass}>Page Showcase Section (Explore Our Impact)</h3>
            <p className={cardDescClass}>Highlights key pages of your website with a quote and toggle cards.</p>
          </div>
          <div className={spaceYClass}>
            <ToggleRow id="show_pages_showcase_section" label="Show Page Showcase Section" checked={showPagesShowcase} onChange={setShowPagesShowcase} />
            <div className={gridClass}>
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass + ' mt-2'} name="pages_showcase_title" value={pagesShowcaseTitle} onChange={(e) => setPagesShowcaseTitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Title Background Color</label>
                <select className={selectClass + ' mt-2'} value={pagesShowcaseTitleBg} onChange={(e) => setPagesShowcaseTitleBg(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subtitle</label>
                <textarea className={textareaClass + ' mt-2'} name="pages_showcase_subtitle" value={pagesShowcaseSubtitle} onChange={(e) => setPagesShowcaseSubtitle(e.target.value)} />
              </div>
            </div>
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-semibold">Quote Section</h4>
              <div className={gridClass}>
                <div className="md:col-span-2">
                  <label className={labelClass}>Quote Text</label>
                  <textarea className={textareaClass + ' mt-2'} placeholder="Inspirational quote..." name="pages_showcase_quote_text" value={pagesShowcaseQuote} onChange={(e) => setPagesShowcaseQuote(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Author Name</label>
                  <input className={inputClass + ' mt-2'} placeholder="Jane Doe" name="pages_showcase_quote_author_name" value={pagesShowcaseQuoteAuthor} onChange={(e) => setPagesShowcaseQuoteAuthor(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Author Title</label>
                  <input className={inputClass + ' mt-2'} placeholder="Executive Director" name="pages_showcase_quote_author_title" value={pagesShowcaseQuoteAuthorTitle} onChange={(e) => setPagesShowcaseQuoteAuthorTitle(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Author Image URL</label>
                  <input className={inputClass + ' mt-2'} placeholder="/images/Hanifa_Girowal.jpeg" name="pages_showcase_quote_author_image" value={pagesShowcaseQuoteAuthorImage} onChange={(e) => setPagesShowcaseQuoteAuthorImage(e.target.value)} />
                <p className="text-xs text-gray-500 mt-1">e.g. <code className="bg-gray-100 px-1">/images/Hanifa_Girowal.jpeg</code></p>
                </div>
                <div>
                  <label className={labelClass}>Quote Background Color</label>
                  <select className={selectClass + ' mt-2'} value={pagesShowcaseQuoteBg} onChange={(e) => setPagesShowcaseQuoteBg(e.target.value)}>
                    {COLOR_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-base font-semibold">Page Showcase Toggle Cards</label>
                <button type="button" onClick={addShowcaseCard} className="inline-flex items-center justify-center gap-1 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-plus w-4 h-4 mr-2">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Add Card
                </button>
              </div>
              {showcaseCards.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No showcase cards added yet. Click &quot;Add Card&quot; to get started.</p>
              ) : (
                <div className="space-y-4">
                  {showcaseCards.map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      Card {i + 1} (configure fields as needed)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Programs Section */}
        <div className={sectionClass}>
          <div className={cardHeaderClass}>
            <h3 className={cardTitleClass}>Featured Programs Section</h3>
            <p className={cardDescClass}>Showcases your featured programs.</p>
          </div>
          <div className={spaceYClass}>
            <ToggleRow id="show_programs_section" label="Show Programs Section" checked={showPrograms} onChange={setShowPrograms} />
            <div className={gridClass}>
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass + ' mt-2'} name="programs_title" value={programsTitle} onChange={(e) => setProgramsTitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Title Background Color</label>
                <select className={selectClass + ' mt-2'} value={programsTitleBg} onChange={(e) => setProgramsTitleBg(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subtitle</label>
                <textarea className={textareaClass + ' mt-2'} name="programs_subtitle" value={programsSubtitle} onChange={(e) => setProgramsSubtitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Button Color</label>
                <select className={selectClass + ' mt-2'} value={programsButtonColor} onChange={(e) => setProgramsButtonColor(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className={sectionClass}>
          <div className={cardHeaderClass}>
            <h3 className={cardTitleClass}>Testimonials Section</h3>
            <p className={cardDescClass}>Showcase quotes from your community and partners.</p>
          </div>
          <div className={spaceYClass}>
            <ToggleRow id="show_testimonial_section" label="Show Testimonials Section" checked={showTestimonials} onChange={setShowTestimonials} showIcon={true} />
            <div className={gridClass}>
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass + ' mt-2'} name="testimonial_title" value={testimonialTitle} onChange={(e) => setTestimonialTitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Title Background Color</label>
                <select className={selectClass + ' mt-2'} value={testimonialTitleBg} onChange={(e) => setTestimonialTitleBg(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subtitle</label>
                <textarea className={textareaClass + ' mt-2'} name="testimonial_subtitle" value={testimonialSubtitle} onChange={(e) => setTestimonialSubtitle(e.target.value)} />
              </div>
            </div>
            <div className="pt-4 border-t">
              <Link
                href={`${base}/TestimonialManagement`}
                className="inline-flex items-center justify-center gap-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 rounded-md text-sm font-medium"
              >
                Manage Testimonials
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-message-square w-4 h-4 ml-2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Career Opportunities Section */}
        <div className={sectionClass}>
          <div className={cardHeaderClass}>
            <h3 className={cardTitleClass}>Career Opportunities Section</h3>
            <p className={cardDescClass}>Shows latest job openings.</p>
          </div>
          <div className={spaceYClass}>
            <ToggleRow id="show_vacancies_section" label="Show Vacancies Section" checked={showVacancies} onChange={setShowVacancies} />
            <div className={gridClass}>
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass + ' mt-2'} name="vacancies_title" value={vacanciesTitle} onChange={(e) => setVacanciesTitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Title Background Color</label>
                <select className={selectClass + ' mt-2'} value={vacanciesTitleBg} onChange={(e) => setVacanciesTitleBg(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subtitle</label>
                <textarea className={textareaClass + ' mt-2'} name="vacancies_subtitle" value={vacanciesSubtitle} onChange={(e) => setVacanciesSubtitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Button Color</label>
                <select className={selectClass + ' mt-2'} value={vacanciesButtonColor} onChange={(e) => setVacanciesButtonColor(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Latest News Section */}
        <div className={sectionClass}>
          <div className={cardHeaderClass}>
            <h3 className={cardTitleClass}>Latest News Section</h3>
            <p className={cardDescClass}>Displays recent blog posts and updates.</p>
          </div>
          <div className={spaceYClass}>
            <ToggleRow id="show_news_section" label="Show News Section" checked={showNews} onChange={setShowNews} />
            <div className={gridClass}>
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass + ' mt-2'} name="news_title" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Title Background Color</label>
                <select className={selectClass + ' mt-2'} value={newsTitleBg} onChange={(e) => setNewsTitleBg(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subtitle</label>
                <textarea className={textareaClass + ' mt-2'} name="news_subtitle" value={newsSubtitle} onChange={(e) => setNewsSubtitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Button Color</label>
                <select className={selectClass + ' mt-2'} value={newsButtonColor} onChange={(e) => setNewsButtonColor(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Organizations Section */}
        <div className={sectionClass}>
          <div className={cardHeaderClass}>
            <h3 className={cardTitleClass}>Partner Organizations Section</h3>
            <p className={cardDescClass}>Display logos of organizations you work with or are related to.</p>
          </div>
          <div className={spaceYClass}>
            <ToggleRow id="show_partners_section" label="Show Partners Section" checked={showPartners} onChange={setShowPartners} />
            <div className={gridClass}>
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass + ' mt-2'} name="partners_title" value={partnersTitle} onChange={(e) => setPartnersTitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Title Background Color</label>
                <select className={selectClass + ' mt-2'} value={partnersTitleBg} onChange={(e) => setPartnersTitleBg(e.target.value)}>
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subtitle</label>
                <textarea className={textareaClass + ' mt-2'} name="partners_subtitle" value={partnersSubtitle} onChange={(e) => setPartnersSubtitle(e.target.value)} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-base font-semibold">Partner Organizations</label>
                <button
                  type="button"
                  onClick={addPartner}
                  className="inline-flex items-center justify-center gap-1 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Add Partner
                </button>
              </div>
              <div className="space-y-4">
                {partnersList.map((partner, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Partner {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removePartner(i)}
                        className="inline-flex items-center justify-center gap-1 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Organization Name</label>
                        <input className={inputClass + ' mt-2'} placeholder="Organization Name" value={partner.name} onChange={(e) => updatePartner(i, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Logo URL</label>
                        <input className={inputClass + ' mt-2'} placeholder="https://example.com/logo.png" value={partner.logoUrl} onChange={(e) => updatePartner(i, 'logoUrl', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Website URL (Optional)</label>
                        <input className={inputClass + ' mt-2'} placeholder="https://organization.com" value={partner.websiteUrl} onChange={(e) => updatePartner(i, 'websiteUrl', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center mt-8">
          <button type="submit" className="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2">
            <SaveIcon />
            Save Changes
          </button>
          {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
          {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
        </div>
      </form>
    </AdminShell>
  );
}
