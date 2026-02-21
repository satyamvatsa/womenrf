'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const sidebarItems = [
  { label: 'Dashboard', href: '/AdminDashboard', icon: 'house' },
  { label: 'Homepage Settings', href: '/HomepageManagement', icon: 'layout-template' },
  { label: 'About Page Settings', href: '/AboutManagement', icon: 'heart' },
  { label: 'Header Settings', href: '/HeaderManagement', icon: 'layout-template' },
  { label: 'Footer Settings', href: '/FooterManagement', icon: 'settings' },
  { label: 'Privacy Policy', href: '/PrivacyPolicyManagement', icon: 'shield' },
  { label: 'Page Content & SEO', href: '/PageSettingManagement', icon: 'settings2' },
  { label: 'Site Management', href: '/SiteManagement', icon: 'globe' },
  { label: 'Donation Management', href: '/DonationManagement', icon: 'hand-heart' },
  { label: 'Donation Options', href: '/DonationOptionManagement', icon: 'layers' },
  { label: 'Blog Posts', href: '/BlogPostManagement', icon: 'book-open' },
  { label: 'Program Management', href: '/ProgramManagement', icon: 'book-open' },
  { label: 'Testimonials', href: '/TestimonialManagement', icon: 'message-square' },
  { label: 'Founder Management', href: '/FounderManagement', icon: 'venetian-mask' },
  { label: 'Team Management', href: '/TeamManagement', icon: 'users' },
  { label: 'Vacancy Management', href: '/VacancyManagement', icon: 'briefcase' },
  { label: 'Job Applications', href: '/ApplicationManagement', icon: 'users' },
  { label: 'Volunteer Management', href: '/VolunteerManagement', icon: 'hand-heart' },
  { label: 'Partnership Management', href: '/PartnershipManagement', icon: 'handshake' },
  { label: 'FAQ Management', href: '/FAQManagement', icon: 'shield' },
  { label: 'Newsletter System', href: '/NewsletterManagement', icon: 'mail' },
  { label: 'User Management', href: '/UserManagement', icon: 'users' },
];

const SvgGlobe = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const icons: Record<string, React.ReactNode> = {
  globe: <SvgGlobe className="mr-3 h-5 w-5" />,
  'log-out': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
  house: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  'layout-template': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <rect width="18" height="7" x="3" y="3" rx="1" />
      <rect width="9" height="7" x="3" y="14" rx="1" />
      <rect width="5" height="7" x="16" y="14" rx="1" />
    </svg>
  ),
  heart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  ),
  settings2: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  ),
  'hand-heart': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  layers: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  ),
  'book-open': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  'message-square': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  'venetian-mask': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  briefcase: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  ),
  handshake: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 4h8" />
    </svg>
  ),
  mail: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

const TABS = ['vision', 'mission', 'values', 'operations', 'quote', 'history', 'impact', 'team', 'links'] as const;
const COLOR_OPTIONS = [
  { value: 'wrf-black', label: 'WRF Dark (#1a1a1a)' },
  { value: 'wrf-purple', label: 'WRF Purple (#6B5B95)' },
  { value: 'wrf-coral', label: 'WRF Coral (#E07A7A)' },
  { value: 'wrf-footer-mauve', label: 'WRF Mauve (#b88a9e)' },
  { value: 'white', label: 'White (#ffffff)' },
];

/** Maps admin color names to actual CSS hex values */
const COLOR_HEX_MAP: Record<string, string> = {
  'primary': '#1a1a1a',
  'secondary': '#6B5B95',
  'accent': '#E07A7A',
  'white': '#ffffff',
  'wrf-black': '#1a1a1a',
  'wrf-purple': '#6B5B95',
  'wrf-coral': '#E07A7A',
  'wrf-footer-mauve': '#b88a9e',
};

function resolveColor(name: string, fallback: string): string {
  return COLOR_HEX_MAP[name] || name || fallback;
}

export default function AboutManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('mission');

  // Mission section state
  const [sectionTitle, setSectionTitle] = useState('Our Mission & History');
  const [titleBgColor, setTitleBgColor] = useState('wrf-black');
  const [titleTextColor, setTitleTextColor] = useState('white');
  const [content, setContent] = useState(
    'To empower and transform Afghan women and girls by delivering peacebuilding, accountability, and digital transformation services through locally grounded and modernized indigenous approaches.'
  );
  const [imageUrl, setImageUrl] = useState(
    '/images/teams.jpeg'
  );
  const [button1Text, setButton1Text] = useState('Join Our Mission');
  const [button1Url, setButton1Url] = useState('Volunteer');
  const [button1Color, setButton1Color] = useState('wrf-purple');
  const [button2Text, setButton2Text] = useState('Explore Programs');
  const [button2Url, setButton2Url] = useState('Programs');
  const [button2Color, setButton2Color] = useState('wrf-coral');
  // Vision section state
  const [visionTitle, setVisionTitle] = useState('Our Vision');
  const [visionTitleBgColor, setVisionTitleBgColor] = useState('wrf-purple');
  const [visionContent, setVisionContent] = useState(
    'A just and peaceful Afghanistan where women can exercise agency with pride, dignity and freedom.'
  );
  const [visionImageUrl, setVisionImageUrl] = useState('/images/teams.jpeg');

  // Core values state (dynamic array)
  const [coreValues, setCoreValues] = useState([
    { id: '1', title: 'Equality & Justice', description: '', color: 'wrf-black' },
    { id: '2', title: 'Empowerment & Leadership', description: '', color: 'wrf-purple' },
    { id: '3', title: 'Community & Solidarity', description: '', color: 'wrf-coral' },
    { id: '4', title: 'Innovation & Sustainability', description: '', color: 'wrf-footer-mauve' },
  ]);

  // Areas of Operations state
  const [operationsTitle, setOperationsTitle] = useState('Areas of Operations');
  const [operationsTitleBgColor, setOperationsTitleBgColor] = useState('wrf-coral');
  const [opsArea1Title, setOpsArea1Title] = useState('Peace Building and Social Cohesion');
  const [opsArea1Desc, setOpsArea1Desc] = useState('');
  const [opsArea2Title, setOpsArea2Title] = useState('Legal Empowerment and International Accountability');
  const [opsArea2Desc, setOpsArea2Desc] = useState('');
  const [opsArea3Title, setOpsArea3Title] = useState('Digital Transformation and Open Gender Data');
  const [opsArea3Desc, setOpsArea3Desc] = useState('');
  const [opsArea4Title, setOpsArea4Title] = useState('Representation and Advocacy');
  const [opsArea4Desc, setOpsArea4Desc] = useState('');

  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  const base = `/${locale}`;
  const isActive = (href: string) => pathname === `${base}${href}`;

  useEffect(() => {
    const auth = localStorage.getItem('wrf_admin_auth');
    const loginTime = localStorage.getItem('wrf_admin_login_time');
    if (auth === 'true' && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed < 24 * 60 * 60 * 1000) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('wrf_admin_auth');
        localStorage.removeItem('wrf_admin_login_time');
        router.push(`${base}/AdminLogin`);
      }
    } else {
      router.push(`${base}/AdminLogin`);
    }
    setIsLoading(false);
  }, [router, base]);

  useEffect(() => {
    loadAdminData<Record<string, any>>('about').then(data => {
      if (!data) return;
      if (data.sectionTitle !== undefined) setSectionTitle(data.sectionTitle);
      if (data.titleBgColor !== undefined) setTitleBgColor(data.titleBgColor);
      if (data.titleTextColor !== undefined) setTitleTextColor(data.titleTextColor);
      if (data.content !== undefined) setContent(data.content);
      if (data.imageUrl !== undefined) setImageUrl(data.imageUrl);
      if (data.button1Text !== undefined) setButton1Text(data.button1Text);
      if (data.button1Url !== undefined) setButton1Url(data.button1Url);
      if (data.button1Color !== undefined) setButton1Color(data.button1Color);
      if (data.button2Text !== undefined) setButton2Text(data.button2Text);
      if (data.button2Url !== undefined) setButton2Url(data.button2Url);
      if (data.button2Color !== undefined) setButton2Color(data.button2Color);
      // Vision section
      if (data.visionTitle !== undefined) setVisionTitle(data.visionTitle);
      if (data.visionTitleBgColor !== undefined) setVisionTitleBgColor(data.visionTitleBgColor);
      if (data.visionContent !== undefined) setVisionContent(data.visionContent);
      if (data.visionImageUrl !== undefined) setVisionImageUrl(data.visionImageUrl);
      // Core values (dynamic array, with backward compatibility for old individual fields)
      if (Array.isArray(data.coreValues) && data.coreValues.length > 0) {
        setCoreValues(data.coreValues);
      } else if (data.valuesEqualityTitle !== undefined) {
        const migrated = [
          { id: '1', title: data.valuesEqualityTitle || 'Equality & Justice', description: data.valuesEqualityDesc || '', color: 'wrf-black' },
          { id: '2', title: data.valuesEmpowermentTitle || 'Empowerment & Leadership', description: data.valuesEmpowermentDesc || '', color: 'wrf-purple' },
          { id: '3', title: data.valuesCommunityTitle || 'Community & Solidarity', description: data.valuesCommunityDesc || '', color: 'wrf-coral' },
          { id: '4', title: data.valuesInnovationTitle || 'Innovation & Sustainability', description: data.valuesInnovationDesc || '', color: 'wrf-footer-mauve' },
        ];
        setCoreValues(migrated);
      }
      // Areas of Operations
      if (data.operationsTitle !== undefined) setOperationsTitle(data.operationsTitle);
      if (data.operationsTitleBgColor !== undefined) setOperationsTitleBgColor(data.operationsTitleBgColor);
      if (data.opsArea1Title !== undefined) setOpsArea1Title(data.opsArea1Title);
      if (data.opsArea1Desc !== undefined) setOpsArea1Desc(data.opsArea1Desc);
      if (data.opsArea2Title !== undefined) setOpsArea2Title(data.opsArea2Title);
      if (data.opsArea2Desc !== undefined) setOpsArea2Desc(data.opsArea2Desc);
      if (data.opsArea3Title !== undefined) setOpsArea3Title(data.opsArea3Title);
      if (data.opsArea3Desc !== undefined) setOpsArea3Desc(data.opsArea3Desc);
      if (data.opsArea4Title !== undefined) setOpsArea4Title(data.opsArea4Title);
      if (data.opsArea4Desc !== undefined) setOpsArea4Desc(data.opsArea4Desc);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('wrf_admin_auth');
    localStorage.removeItem('wrf_admin_login_time');
    router.push(`${base}/AdminLogin`);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    const data = {
      sectionTitle, titleBgColor, titleTextColor, content, imageUrl,
      button1Text, button1Url, button1Color,
      button2Text, button2Url, button2Color,
      visionTitle, visionTitleBgColor, visionContent, visionImageUrl,
      coreValues,
      operationsTitle, operationsTitleBgColor,
      opsArea1Title, opsArea1Desc,
      opsArea2Title, opsArea2Desc,
      opsArea3Title, opsArea3Desc,
      opsArea4Title, opsArea4Desc,
    };
    const ok = await saveAdminData('about', data);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-body">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex">
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-heading font-bold text-primary">WRF Admin</h1>
              <span className="text-sm text-gray-500 font-body">Women&apos;s Rights First</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href={base} className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2">
                <SvgGlobe className="w-4 h-4" />
                View Website
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                {icons['log-out']}
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <aside className="w-64 bg-white shadow-sm min-h-screen flex-shrink-0 pt-16">
        <nav className="mt-8">
          <div className="px-4 mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-body">Management</h3>
          </div>
          <div className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={`${base}${item.href}`}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href) ? 'bg-secondary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icons[item.icon] || icons.house}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 pt-24">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">About Page Management</h1>
              <p className="text-gray-600 font-body">Manage content for the About Us page</p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2 bg-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                <path d="M7 3v4a1 1 0 0 0 1 1h7" />
              </svg>
              Save Changes
            </button>
            {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
            {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
          </div>

          <div className="w-full" dir="ltr">
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 grid w-full grid-cols-9"
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="mt-2 space-y-6">
              {activeTab === 'mission' && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-5 h-5">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      Mission and History Section
                    </h3>
                  </div>
                  <div className="p-6 pt-0 space-y-4">
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Section Title</label>
                      <input
                        type="text"
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:text-sm"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium leading-none">Title BG Color</label>
                        <select
                          value={titleBgColor}
                          onChange={(e) => setTitleBgColor(e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {COLOR_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium leading-none">Title Text Color</label>
                        <select
                          value={titleTextColor}
                          onChange={(e) => setTitleTextColor(e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {COLOR_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none">Content (HTML enabled)</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none">Image URL</label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:text-sm"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Button 1 (Join Our Mission)</h3>
                        <div>
                          <label className="text-sm font-medium leading-none">Text</label>
                          <input
                            type="text"
                            value={button1Text}
                            onChange={(e) => setButton1Text(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary md:text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium leading-none">URL (page name, e.g. &quot;Volunteer&quot;)</label>
                          <input
                            type="text"
                            value={button1Url}
                            onChange={(e) => setButton1Url(e.target.value)}
                            placeholder="Volunteer"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary md:text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium leading-none">Color</label>
                          <select
                            value={button1Color}
                            onChange={(e) => setButton1Color(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {COLOR_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold">Button 2 (Explore Programs)</h3>
                        <div>
                          <label className="text-sm font-medium leading-none">Text</label>
                          <input
                            type="text"
                            value={button2Text}
                            onChange={(e) => setButton2Text(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary md:text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium leading-none">URL (page name, e.g. &quot;ProgramPage/legal&quot;)</label>
                          <input
                            type="text"
                            value={button2Url}
                            onChange={(e) => setButton2Url(e.target.value)}
                            placeholder="ProgramPage/legal"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary md:text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium leading-none">Color</label>
                          <select
                            value={button2Color}
                            onChange={(e) => setButton2Color(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {COLOR_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">Live Preview</h3>
                      <div className="rounded-lg border border-gray-200 bg-white p-6 overflow-hidden">
                        <div className="grid items-center gap-8 lg:grid-cols-2">
                          <div className="text-left">
                            <div
                              className="inline-block p-4"
                              style={{ backgroundColor: resolveColor(titleBgColor, '#1a1a1a') }}
                            >
                              <h2 className="text-2xl font-bold" style={{ color: resolveColor(titleTextColor, '#ffffff') }}>
                                {sectionTitle || 'Our Mission & History'}
                              </h2>
                            </div>
                            <p className="mb-6 mt-4 text-sm leading-relaxed text-gray-700 max-w-md">
                              {content ? content.slice(0, 200) + (content.length > 200 ? '...' : '') : 'Content will appear here...'}
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <span
                                className="inline-flex items-center rounded-none px-5 py-2 text-sm font-semibold text-white"
                                style={{ backgroundColor: resolveColor(button1Color, '#6B5B95') }}
                              >
                                {button1Text || 'Join Our Mission'}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                                  <path d="M5 12h14" />
                                  <path d="m12 5 7 7-7 7" />
                                </svg>
                              </span>
                              <span
                                className="inline-flex items-center rounded-none px-5 py-2 text-sm font-semibold text-white"
                                style={{ backgroundColor: resolveColor(button2Color, '#E07A7A') }}
                              >
                                {button2Text || 'Explore Programs'}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                                  <path d="M5 12h14" />
                                  <path d="m12 5 7 7-7 7" />
                                </svg>
                              </span>
                            </div>
                          </div>
                          <div>
                            {imageUrl ? (
                              <img src={imageUrl} alt="Preview" className="h-48 w-full rounded object-cover shadow" />
                            ) : (
                              <div className="flex h-48 w-full items-center justify-center rounded bg-gray-100 text-gray-400 text-sm">
                                Image preview
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vision' && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Our Vision Section
                    </h3>
                  </div>
                  <div className="p-6 pt-0 space-y-4">
                    <div>
                      <label className="text-sm font-medium leading-none">Section Title</label>
                      <input
                        type="text"
                        value={visionTitle}
                        onChange={(e) => setVisionTitle(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none">Title BG Color</label>
                      <select
                        value={visionTitleBgColor}
                        onChange={(e) => setVisionTitleBgColor(e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {COLOR_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none">Content (HTML enabled)</label>
                      <textarea
                        value={visionContent}
                        onChange={(e) => setVisionContent(e.target.value)}
                        rows={4}
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none">Image URL</label>
                      <input
                        type="url"
                        value={visionImageUrl}
                        onChange={(e) => setVisionImageUrl(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:text-sm"
                      />
                    </div>

                    {/* Live Preview */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">Live Preview</h3>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 overflow-hidden">
                        <div className="grid items-center gap-8 lg:grid-cols-2">
                          <div className="text-left">
                            <div
                              className="inline-block p-4"
                              style={{ backgroundColor: resolveColor(visionTitleBgColor, '#6B5B95') }}
                            >
                              <h2 className="text-2xl font-bold text-white">
                                {visionTitle || 'Our Vision'}
                              </h2>
                            </div>
                            <p className="mb-6 mt-4 text-sm leading-relaxed text-gray-700 max-w-md">
                              {visionContent ? visionContent.slice(0, 200) + (visionContent.length > 200 ? '...' : '') : 'Content will appear here...'}
                            </p>
                          </div>
                          <div>
                            {visionImageUrl ? (
                              <img src={visionImageUrl} alt="Vision Preview" className="h-48 w-full rounded object-cover shadow" />
                            ) : (
                              <div className="flex h-48 w-full items-center justify-center rounded bg-gray-100 text-gray-400 text-sm">
                                Image preview
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Core Values
                    </h3>
                    <p className="text-sm text-gray-500">Add, edit, or remove core values. These appear as expandable cards on the About page.</p>
                  </div>
                  <div className="p-6 pt-0 space-y-6">
                    {coreValues.map((val, idx) => (
                      <div key={val.id} className="rounded-md border border-gray-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{ backgroundColor: resolveColor(val.color, '#1a1a1a') }}
                            />
                            <label className="text-sm font-semibold leading-none">Value {idx + 1}</label>
                          </div>
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                title="Move up"
                                onClick={() => {
                                  const updated = [...coreValues];
                                  [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                  setCoreValues(updated);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-700 rounded"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                              </button>
                            )}
                            {idx < coreValues.length - 1 && (
                              <button
                                type="button"
                                title="Move down"
                                onClick={() => {
                                  const updated = [...coreValues];
                                  [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                                  setCoreValues(updated);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-700 rounded"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                              </button>
                            )}
                            <button
                              type="button"
                              title="Remove value"
                              onClick={() => setCoreValues(coreValues.filter((_, i) => i !== idx))}
                              className="p-1 text-gray-400 hover:text-red-600 rounded ml-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500">Title</label>
                            <input
                              type="text"
                              value={val.title}
                              onChange={(e) => {
                                const updated = [...coreValues];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setCoreValues(updated);
                              }}
                              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Card Color</label>
                            <select
                              value={val.color}
                              onChange={(e) => {
                                const updated = [...coreValues];
                                updated[idx] = { ...updated[idx], color: e.target.value };
                                setCoreValues(updated);
                              }}
                              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              {COLOR_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Description</label>
                          <textarea
                            value={val.description}
                            onChange={(e) => {
                              const updated = [...coreValues];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setCoreValues(updated);
                            }}
                            rows={3}
                            placeholder="Describe this core value..."
                            className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const newId = String(Date.now());
                        setCoreValues([...coreValues, { id: newId, title: '', description: '', color: 'wrf-black' }]);
                      }}
                      className="inline-flex items-center gap-2 rounded-md border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors w-full justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                      Add Value
                    </button>

                    <p className="text-xs text-gray-400">Tip: These values appear as expandable cards on the About page. Click &quot;Add Value&quot; to add more. Use the arrows to reorder and the trash icon to remove.</p>
                  </div>
                </div>
              )}
              {activeTab === 'operations' && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                      </svg>
                      Areas of Operations
                    </h3>
                    <p className="text-sm text-gray-500">Edit the section title and the four operational areas displayed on the About page.</p>
                  </div>
                  <div className="p-6 pt-0 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium leading-none">Section Title</label>
                        <input
                          type="text"
                          value={operationsTitle}
                          onChange={(e) => setOperationsTitle(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium leading-none">Title BG Color</label>
                        <select
                          value={operationsTitleBgColor}
                          onChange={(e) => setOperationsTitleBgColor(e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {COLOR_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {[
                      { num: 1, title: opsArea1Title, setTitle: setOpsArea1Title, desc: opsArea1Desc, setDesc: setOpsArea1Desc, color: 'bg-wrf-black' },
                      { num: 2, title: opsArea2Title, setTitle: setOpsArea2Title, desc: opsArea2Desc, setDesc: setOpsArea2Desc, color: 'bg-wrf-purple' },
                      { num: 3, title: opsArea3Title, setTitle: setOpsArea3Title, desc: opsArea3Desc, setDesc: setOpsArea3Desc, color: 'bg-wrf-coral' },
                      { num: 4, title: opsArea4Title, setTitle: setOpsArea4Title, desc: opsArea4Desc, setDesc: setOpsArea4Desc, color: 'bg-wrf-footer-mauve' },
                    ].map((area) => (
                      <div key={area.num} className="rounded-md border border-gray-200 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-3 h-3 rounded-full ${area.color}`} />
                          <label className="text-sm font-semibold leading-none">Area {area.num}</label>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Title</label>
                          <input
                            type="text"
                            value={area.title}
                            onChange={(e) => area.setTitle(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Description</label>
                          <textarea
                            value={area.desc}
                            onChange={(e) => area.setDesc(e.target.value)}
                            rows={3}
                            placeholder="Describe this area of operations..."
                            className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Live Preview */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">Live Preview</h3>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 overflow-hidden">
                        <div
                          className="inline-block p-3 mb-4"
                          style={{ backgroundColor: resolveColor(operationsTitleBgColor, '#E07A7A') }}
                        >
                          <h2 className="text-xl font-bold text-white">{operationsTitle || 'Areas of Operations'}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { title: opsArea1Title, bg: '#1a1a1a' },
                            { title: opsArea2Title, bg: '#6B5B95' },
                            { title: opsArea3Title, bg: '#E07A7A' },
                            { title: opsArea4Title, bg: '#b88a9e' },
                          ].map((a) => (
                            <div key={a.title} className="p-4 text-white rounded" style={{ backgroundColor: a.bg }}>
                              <h3 className="text-sm font-bold">{a.title}</h3>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'quote' && (
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-2">
                  <h3 className="text-lg font-semibold">Quote Section</h3>
                  <p className="text-gray-600 font-body">This section displays an inspirational quote on the About page. Content is managed through the translation files.</p>
                  <p className="text-sm text-amber-600 font-medium">No admin changes needed — the frontend uses translated default content.</p>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-2">
                  <h3 className="text-lg font-semibold">History / Timeline Section</h3>
                  <p className="text-gray-600 font-body">This section shows the organization&apos;s journey timeline (2019–2025). Content is managed through the translation files.</p>
                  <p className="text-sm text-amber-600 font-medium">No admin changes needed — the frontend uses translated default content.</p>
                </div>
              )}
              {activeTab === 'impact' && (
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-2">
                  <h3 className="text-lg font-semibold">Impact Statistics Section</h3>
                  <p className="text-gray-600 font-body">This section shows impact metrics (programs, countries, etc.). Content is managed through the translation files.</p>
                  <p className="text-sm text-amber-600 font-medium">No admin changes needed — the frontend uses translated default content.</p>
                </div>
              )}
              {activeTab === 'team' && (
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-2">
                  <h3 className="text-lg font-semibold">Team Preview Section</h3>
                  <p className="text-gray-600 font-body">This section shows a brief team preview on the About page. To manage full team profiles, use the <strong>Team Management</strong> page in the sidebar.</p>
                  <p className="text-sm text-amber-600 font-medium">No admin changes needed — team data is managed separately.</p>
                </div>
              )}
              {activeTab === 'links' && (
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-2">
                  <h3 className="text-lg font-semibold">Get Involved Links Section</h3>
                  <p className="text-gray-600 font-body">This section shows &quot;Get Involved&quot; action cards (Donate, Partner, Volunteer, Contact). Content is managed through the translation files.</p>
                  <p className="text-sm text-amber-600 font-medium">No admin changes needed — the frontend uses translated default content.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
