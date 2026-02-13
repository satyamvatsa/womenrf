'use client';

import { useState, useEffect } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const SvgSettings = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SvgMail = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SvgBuilding2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);

const SvgFileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

const SvgChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SvgMessageSquare = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

type InquiryStatus = 'New' | 'In Review' | 'Contacted' | 'Accepted' | 'Declined';

type Inquiry = {
  id: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  type: string;
  status: InquiryStatus;
  size: string;
  message: string;
  phone?: string;
  submittedDate: string;
  /** ISO string for persisting when saving */
  submittedAt?: string;
};

/** Shape stored by the public form submit API (partnership-inquiries) */
type RawInquiry = {
  id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  partnership_type: string;
  organization_size?: string;
  message: string;
  submittedAt: string;
  status: string;
};

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: 'New', label: 'New' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Declined', label: 'Declined' },
];

function formatSubmittedDate(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

function mapRawToInquiry(r: RawInquiry): Inquiry {
  const status = r.status === 'new' ? 'New' : (r.status as InquiryStatus);
  return {
    id: r.id,
    organizationName: r.organization_name ?? '',
    contactName: r.contact_person ?? '',
    contactEmail: r.email ?? '',
    type: r.partnership_type ?? '',
    status: STATUS_OPTIONS.some(o => o.value === status) ? status : 'New',
    size: r.organization_size ?? '',
    message: r.message ?? '',
    phone: r.phone,
    submittedDate: formatSubmittedDate(r.submittedAt),
    submittedAt: r.submittedAt,
  };
}

function mapInquiryToRaw(i: Inquiry): RawInquiry {
  return {
    id: i.id,
    organization_name: i.organizationName,
    contact_person: i.contactName,
    email: i.contactEmail,
    phone: i.phone,
    partnership_type: i.type,
    organization_size: i.size || undefined,
    message: i.message,
    submittedAt: i.submittedAt ?? new Date().toISOString(),
    status: i.status === 'New' ? 'new' : i.status,
  };
}

const btnSecondary =
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2';
const selectClass =
  'flex h-10 w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export default function PartnershipManagementPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'partnerships' | 'content'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false);
  const [messageDialogInquiry, setMessageDialogInquiry] = useState<Inquiry | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    setLoading(true);
    loadAdminData<RawInquiry[]>('partnership-inquiries').then(data => {
      const list = Array.isArray(data) ? data : [];
      setInquiries(list.map(mapRawToInquiry));
      setLoading(false);
    });
  }, []);

  const persist = async (updatedInquiries: Inquiry[]) => {
    setSaveStatus('saving');
    const raw = updatedInquiries.map(mapInquiryToRaw);
    const ok = await saveAdminData('partnership-inquiries', raw);
    if (ok) setInquiries(updatedInquiries);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    const updatedInquiries = inquiries.map((i) => (i.id === id ? { ...i, status } : i));
    setInquiries(updatedInquiries);
    persist(updatedInquiries);
  };

  const inquiryCount = inquiries.length;
  const partnershipCount = 3; // placeholder

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Partnership Management</h1>
            <p className="text-gray-600 font-body">Manage partnerships, page content, and inquiries</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && <span className="text-sm text-gray-500">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-green-600">Saved!</span>}
            {saveStatus === 'error' && <span className="text-sm text-red-600">Save failed</span>}
            <button
              type="button"
              className={btnSecondary}
              aria-haspopup="dialog"
              aria-expanded={pageSettingsOpen}
              onClick={() => setPageSettingsOpen(true)}
            >
              <SvgSettings className="w-4 h-4 mr-2" />
              Page Settings
            </button>
          </div>
        </div>

        <div className="space-y-6" dir="ltr">
          {/* Tabs */}
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'inquiries'}
              aria-controls="partnership-tabpanel-inquiries"
              id="partnership-tab-inquiries"
              className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'inquiries' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
              onClick={() => setActiveTab('inquiries')}
            >
              <SvgMail className="w-4 h-4" />
              Partnership Inquiries ({inquiryCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'partnerships'}
              aria-controls="partnership-tabpanel-partnerships"
              id="partnership-tab-partnerships"
              className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'partnerships' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
              onClick={() => setActiveTab('partnerships')}
            >
              <SvgBuilding2 className="w-4 h-4" />
              Partnerships ({partnershipCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'content'}
              aria-controls="partnership-tabpanel-content"
              id="partnership-tab-content"
              className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'content' ? 'bg-background text-foreground shadow-sm' : ''
              }`}
              onClick={() => setActiveTab('content')}
            >
              <SvgFileText className="w-4 h-4" />
              Page Content
            </button>
          </div>

          {/* Tab panel: Partnership Inquiries */}
          <div
            role="tabpanel"
            id="partnership-tabpanel-inquiries"
            aria-labelledby="partnership-tab-inquiries"
            tabIndex={0}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
            hidden={activeTab !== 'inquiries'}
          >
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Incoming Partnership Inquiries</h3>
                <p className="text-sm text-gray-500">
                  Review and manage all partnership requests submitted through the website form.
                </p>
              </div>
              <div className="p-6 pt-0">
                {loading ? (
                  <p className="text-gray-500">Loading inquiries...</p>
                ) : inquiries.length === 0 ? (
                  <p className="text-gray-500">No partnership inquiries yet. Inquiries submitted via the Partnership page form will appear here.</p>
                ) : (
                <div className="space-y-6">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="rounded-lg border text-card-foreground shadow-sm bg-gray-50/50"
                    >
                      <div className="flex flex-col space-y-1.5 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading">
                              {inquiry.organizationName}
                            </h3>
                            <p className="text-gray-600 font-body text-sm">
                              Contact: {inquiry.contactName} ({inquiry.contactEmail})
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold bg-secondary text-white">
                                {inquiry.type}
                              </span>
                              <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold bg-blue-500 text-white">
                                {inquiry.status}
                              </span>
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                {inquiry.size}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              className={selectClass}
                              value={inquiry.status}
                              onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value as InquiryStatus)}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              className={btnSecondary}
                              aria-haspopup="dialog"
                              onClick={() => setMessageDialogInquiry(inquiry)}
                            >
                              <SvgMessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="space-y-3">
                          <p className="text-gray-700">{inquiry.message}</p>
                          {inquiry.phone && (
                            <p>
                              <strong>Phone:</strong> {inquiry.phone}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">Submitted: {inquiry.submittedDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab panel: Partnerships */}
          <div
            role="tabpanel"
            id="partnership-tabpanel-partnerships"
            aria-labelledby="partnership-tab-partnerships"
            tabIndex={0}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
            hidden={activeTab !== 'partnerships'}
          >
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Partnerships</h3>
                <p className="text-sm text-gray-500">Manage active and past partnerships.</p>
              </div>
              <div className="p-6 pt-0 space-y-2">
                <p className="text-gray-600">Active partnerships are displayed on the homepage via the <strong>Partner Organizations</strong> section in <strong>Homepage Settings</strong>.</p>
                <p className="text-sm text-amber-600 font-medium">To manage partner logos and links, go to Homepage Settings &gt; Partner Organizations Section.</p>
              </div>
            </div>
          </div>

          {/* Tab panel: Page Content */}
          <div
            role="tabpanel"
            id="partnership-tabpanel-content"
            aria-labelledby="partnership-tab-content"
            tabIndex={0}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
            hidden={activeTab !== 'content'}
          >
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Page Content</h3>
                <p className="text-sm text-gray-500">Edit the partnership page content and copy.</p>
              </div>
              <div className="p-6 pt-0 space-y-2">
                <p className="text-gray-600">The Partnership page content (hero, benefits, form, testimonials) is currently managed through the translation files (en.ts, fa.ts, ps.ts) and renders automatically.</p>
                <p className="text-sm text-amber-600 font-medium">No admin changes needed — the frontend uses translated default content. Partnership inquiries submitted through the form appear in the &quot;Partnership Inquiries&quot; tab above.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Settings dialog */}
      {pageSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="page-settings-title">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={() => setPageSettingsOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg mx-4">
            <h2 id="page-settings-title" className="text-xl font-semibold mb-4">
              Partnership Page Settings
            </h2>
            <p className="text-sm text-gray-600 mb-4">Configure the partnership page form and options.</p>
            <button type="button" className={btnSecondary} onClick={() => setPageSettingsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Message / notes dialog */}
      {messageDialogInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="message-dialog-title">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={() => setMessageDialogInquiry(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg mx-4">
            <h2 id="message-dialog-title" className="text-xl font-semibold mb-2">
              {messageDialogInquiry.organizationName}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {messageDialogInquiry.contactName} ({messageDialogInquiry.contactEmail})
            </p>
            <div className="rounded-md border bg-gray-50 p-4 text-gray-700 mb-4">
              {messageDialogInquiry.message}
            </div>
            {messageDialogInquiry.phone && (
              <p className="text-sm mb-4">
                <strong>Phone:</strong> {messageDialogInquiry.phone}
              </p>
            )}
            <p className="text-xs text-gray-500 mb-4">Submitted: {messageDialogInquiry.submittedDate}</p>
            <button type="button" className={btnSecondary} onClick={() => setMessageDialogInquiry(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
