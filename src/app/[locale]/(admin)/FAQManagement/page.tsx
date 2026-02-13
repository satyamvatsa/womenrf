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

const SvgCircleHelp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const SvgFolder = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

const SvgPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const SvgPen = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
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

const SvgX = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

type FAQCategory = { id: string; name: string; colorClass: string; displayOrder?: number };
type FAQ = {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  isActive: boolean;
  backgroundColor?: string;
  textColor?: string;
  displayOrder?: number;
};

const FAQ_BG_OPTIONS = [
  { value: 'bg-wrf-purple', label: 'Purple' },
  { value: 'bg-wrf-purple-dark', label: 'Dark Purple' },
  { value: 'bg-wrf-footer-mauve', label: 'Mauve / Pink' },
  { value: 'bg-wrf-coral', label: 'Coral / Red' },
  { value: 'bg-wrf-footer-dark', label: 'Dark Charcoal' },
  { value: 'bg-wrf-black', label: 'Black' },
];
const FAQ_TEXT_OPTIONS = [
  { value: 'text-white', label: 'White' },
  { value: 'text-white/90', label: 'White (90%)' },
];

const CATEGORY_COLOR_OPTIONS = [
  { value: 'bg-wrf-purple', label: 'Purple' },
  { value: 'bg-wrf-purple-dark', label: 'Dark Purple' },
  { value: 'bg-wrf-footer-mauve', label: 'Mauve / Pink' },
  { value: 'bg-wrf-coral', label: 'Coral / Red' },
  { value: 'bg-wrf-footer-dark', label: 'Dark Charcoal' },
  { value: 'bg-wrf-black', label: 'Black' },
];

const defaultCategories: FAQCategory[] = [
  { id: 'cat-1', name: 'General Questions', colorClass: 'bg-wrf-purple', displayOrder: 1 },
  { id: 'cat-2', name: 'Programs & Services', colorClass: 'bg-wrf-coral', displayOrder: 2 },
  { id: 'cat-3', name: 'Getting Involved', colorClass: 'bg-wrf-footer-mauve', displayOrder: 3 },
  { id: 'cat-4', name: 'Contact & Support', colorClass: 'bg-wrf-black', displayOrder: 4 },
];

/** Reference order (top to bottom): 1.What is WRF, 2.How volunteer, 3.Get in touch, 4.Programs, 5.How long, 6.Donation */
const defaultFAQs: FAQ[] = [
  { id: 'faq-1', question: "What is Women's Rights First (WRF)?", answer: "Women's Rights First is an Afghan women–led organization committed to defending, restoring, and advancing the rights and dignity of Afghan women and girls. We document human rights violations as legal evidence, support survivor-led advocacy for justice and accountability, and empower local women peacebuilders to lead dialogue, mediation, and community resilience efforts. We work to ensure that Afghan women are not erased, that their voices shape the future of Afghanistan, and that no peace or policy is ever made in their absence.", categoryId: 'cat-1', isActive: true, backgroundColor: 'bg-wrf-purple', textColor: 'text-white', displayOrder: 1 },
  { id: 'faq-4', question: 'How can I volunteer with WRF?', answer: "WRF welcomes volunteers who are dedicated to advancing the rights, dignity, and agency of Afghan women and girls. We particularly value expertise in research, legal analysis, translation, digital security, advocacy, communications, and survivor-centered documentation. If you are interested in contributing, please contact us through our website or email us with a brief summary of your skills, area of interest, and availability. Volunteer opportunities are reviewed on a rolling basis, with careful consideration for safety, confidentiality, and alignment with our mission.", categoryId: 'cat-3', isActive: true, backgroundColor: 'bg-wrf-purple-dark', textColor: 'text-white', displayOrder: 2 },
  { id: 'faq-6', question: 'How do I get in touch with WRF?', answer: 'You can reach us via email, phone, or through our contact form on the website. Our team typically responds within 24-48 hours during business days.', categoryId: 'cat-4', isActive: true, backgroundColor: 'bg-wrf-footer-mauve', textColor: 'text-white', displayOrder: 3 },
  { id: 'faq-3', question: 'What programs does WRF offer?', answer: 'WRF runs four key programs:\n• Accountability & Documentation — gathering legal evidence of human rights violations\n• Peacebuilding — training and supporting Afghan women as mediators and negotiators\n• Digital Transformation & Open Gender Data — using technology to protect evidence and visibility\n• Advocacy & Representation — amplifying Afghan women\'s voices in global decision-making spaces', categoryId: 'cat-2', isActive: true, backgroundColor: 'bg-wrf-coral', textColor: 'text-white', displayOrder: 4 },
  { id: 'faq-2', question: 'How long has WRF been operating?', answer: 'WRF was founded in 2022 and has been actively serving since then, working to defend and advance the rights of Afghan women and girls through documentation, peacebuilding, advocacy, and digital protection.', categoryId: 'cat-1', isActive: true, backgroundColor: 'bg-wrf-footer-dark', textColor: 'text-white', displayOrder: 5 },
  { id: 'faq-5', question: "Can I make a donation to support WRF's work?", answer: 'Yes, donations are greatly appreciated and help us continue our vital work. You can donate online through our secure portal, by check, or through recurring monthly donations.', categoryId: 'cat-4', isActive: true, backgroundColor: 'bg-wrf-black', textColor: 'text-white', displayOrder: 6 },
];

export default function FAQManagementPage() {
  const [activeTab, setActiveTab] = useState<'faqs' | 'categories'>('faqs');
  const [categories, setCategories] = useState<FAQCategory[]>(defaultCategories);
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFAQs);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [faqCategoryId, setFaqCategoryId] = useState('');
  const [faqIsActive, setFaqIsActive] = useState(true);
  const [faqBackgroundColor, setFaqBackgroundColor] = useState('bg-wrf-purple');
  const [faqTextColor, setFaqTextColor] = useState('text-white');
  const [faqDisplayOrder, setFaqDisplayOrder] = useState(1);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-wrf-purple');
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    loadAdminData<{ categories: FAQCategory[]; faqs: FAQ[] }>('faqs').then(data => {
      if (data?.categories) setCategories(data.categories);
      if (data?.faqs) setFaqs(data.faqs);
    });
  }, []);

  const persist = async (updatedCategories: FAQCategory[], updatedFaqs: FAQ[]) => {
    setSaveStatus('saving');
    const ok = await saveAdminData('faqs', { categories: updatedCategories, faqs: updatedFaqs });
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const openAddFaq = () => {
    setEditingFaqId(null);
    setQuestion('');
    setAnswer('');
    setFaqCategoryId(categories[0]?.id ?? '');
    setFaqIsActive(true);
    setFaqBackgroundColor('bg-wrf-purple');
    setFaqTextColor('text-white');
    const maxOrder = faqs.length ? Math.max(...faqs.map((f) => f.displayOrder ?? 0)) : 0;
    setFaqDisplayOrder(maxOrder + 1);
    setFaqDialogOpen(true);
  };

  const openEditFaq = (faq: FAQ) => {
    setEditingFaqId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setFaqCategoryId(faq.categoryId);
    setFaqIsActive(faq.isActive);
    setFaqBackgroundColor(faq.backgroundColor ?? 'bg-wrf-purple');
    setFaqTextColor(faq.textColor ?? 'text-white');
    setFaqDisplayOrder(faq.displayOrder ?? 999);
    setFaqDialogOpen(true);
  };

  const closeFaqDialog = () => {
    setFaqDialogOpen(false);
    setEditingFaqId(null);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    const order = Math.max(1, Math.floor(Number(faqDisplayOrder)) || 1);
    let updatedFaqs: FAQ[];
    if (editingFaqId) {
      updatedFaqs = faqs.map((f) =>
        f.id === editingFaqId
          ? { ...f, question, answer, categoryId: faqCategoryId, isActive: faqIsActive, backgroundColor: faqBackgroundColor, textColor: faqTextColor, displayOrder: order }
          : f
      );
    } else {
      updatedFaqs = [
        ...faqs,
        { id: 'faq-' + Date.now(), question, answer, categoryId: faqCategoryId, isActive: faqIsActive, backgroundColor: faqBackgroundColor, textColor: faqTextColor, displayOrder: order },
      ];
    }
    setFaqs(updatedFaqs);
    persist(categories, updatedFaqs);
    closeFaqDialog();
  };

  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = faqs.filter((f) => f.id !== id);
    setFaqs(updatedFaqs);
    persist(categories, updatedFaqs);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const id = 'cat-' + Date.now();
    const maxOrder = categories.length ? Math.max(...categories.map((c) => c.displayOrder ?? 0)) : 0;
    const updatedCategories = [...categories, { id, name: newCategoryName.trim(), colorClass: newCategoryColor, displayOrder: maxOrder + 1 }];
    setCategories(updatedCategories);
    persist(updatedCategories, faqs);
    setNewCategoryName('');
    setNewCategoryColor('bg-wrf-purple');
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter((c) => c.id !== id);
    const fallbackId = updatedCategories[0]?.id ?? '';
    const updatedFaqs = faqs.map((f) => (f.categoryId === id ? { ...f, categoryId: fallbackId } : f));
    setCategories(updatedCategories);
    setFaqs(updatedFaqs);
    persist(updatedCategories, updatedFaqs);
  };

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
  const textareaClass =
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const cardClass = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const btnPrimary =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 px-3 py-2 bg-primary hover:bg-primary/90';
  const btnSecondary =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3';
  const btnSecondaryPurple =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 px-3 py-2 bg-secondary hover:bg-secondary/90';
  const btnDanger = btnSecondary + ' text-red-600';

  const tabBase =
    'justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex items-center gap-2';
  const tabInactive = 'text-muted-foreground';
  const tabActive = 'bg-background text-foreground shadow-sm';

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">FAQ Management</h1>
            <p className="text-gray-600 font-body">Manage FAQ categories, questions, and page settings</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && <span className="text-sm text-gray-500">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-green-600">Saved!</span>}
            {saveStatus === 'error' && <span className="text-sm text-red-600">Save failed</span>}
            <button
              type="button"
              onClick={() => setSettingsDialogOpen(true)}
              className={btnSecondary}
              aria-haspopup="dialog"
              aria-expanded={settingsDialogOpen}
            >
              <SvgSettings className="w-4 h-4 mr-2" />
              Page Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6" dir="ltr">
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'faqs'}
              aria-controls="tabpanel-faqs"
              id="tab-faqs"
              tabIndex={activeTab === 'faqs' ? 0 : -1}
              className={`${tabBase} ${activeTab === 'faqs' ? tabActive : tabInactive}`}
              onClick={() => setActiveTab('faqs')}
            >
              <SvgCircleHelp className="w-4 h-4" />
              FAQs ({faqs.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'categories'}
              aria-controls="tabpanel-categories"
              id="tab-categories"
              tabIndex={activeTab === 'categories' ? 0 : -1}
              className={`${tabBase} ${activeTab === 'categories' ? tabActive : tabInactive}`}
              onClick={() => setActiveTab('categories')}
            >
              <SvgFolder className="w-4 h-4" />
              Categories ({categories.length})
            </button>
          </div>

          {/* FAQs tab panel */}
          <div
            role="tabpanel"
            id="tabpanel-faqs"
            aria-labelledby="tab-faqs"
            hidden={activeTab !== 'faqs'}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-heading font-semibold">Manage FAQs</h2>
              <button type="button" onClick={openAddFaq} className={btnSecondaryPurple} aria-haspopup="dialog">
                <SvgPlus className="w-4 h-4 mr-2" />
                Add FAQ
              </button>
            </div>
            <div className="grid gap-4">
              {[...faqs].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)).map((faq) => {
                const cat = getCategoryById(faq.categoryId);
                return (
                  <div key={faq.id} className={cardClass}>
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold tracking-tight font-heading text-lg">{faq.question}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            {cat && (
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent text-white ${cat.colorClass}`}
                              >
                                {cat.name}
                              </span>
                            )}
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary text-primary-foreground">
                              {faq.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openEditFaq(faq)} className={btnSecondary} aria-label="Edit">
                            <SvgPen className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => handleDeleteFaq(faq.id)} className={btnDanger} aria-label="Delete">
                            <SvgTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <p className="text-gray-600 font-body line-clamp-2">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories tab panel */}
          <div
            role="tabpanel"
            id="tabpanel-categories"
            aria-labelledby="tab-categories"
            hidden={activeTab !== 'categories'}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
          >
            <h2 className="text-xl font-heading font-semibold">Manage Categories</h2>
            <div className="space-y-2 mb-4">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${cat.colorClass}`} />
                    <span>{cat.name}</span>
                  </div>
                  <button type="button" onClick={() => handleDeleteCategory(cat.id)} className={btnSecondary} aria-label={`Delete ${cat.name}`}>
                    <SvgTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className={inputClass}
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
              />
              <select className={`${inputClass} w-[180px]`} value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)}>
                {CATEGORY_COLOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button type="button" onClick={handleAddCategory} className={btnPrimary}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Settings Dialog */}
      {settingsDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" aria-modal="true" role="dialog" aria-labelledby="settings-dialog-title">
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 id="settings-dialog-title" className="text-xl font-semibold">
                FAQ Page Settings
              </h2>
              <button type="button" onClick={() => setSettingsDialogOpen(false)} className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent" aria-label="Close">
                <SvgX className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Configure FAQ page title, meta description, and other display options here.</p>
            <div className="flex justify-end">
              <button type="button" onClick={() => setSettingsDialogOpen(false)} className={btnPrimary}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit FAQ Dialog */}
      {faqDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" aria-modal="true" role="dialog" aria-labelledby="faq-dialog-title">
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 id="faq-dialog-title" className="text-xl font-semibold">
                {editingFaqId ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button type="button" onClick={closeFaqDialog} className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent" aria-label="Close">
                <SvgX className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className={labelClass}>Question</label>
                <input type="text" className={inputClass} required value={question} onChange={(e) => setQuestion(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Answer</label>
                <textarea className={textareaClass} rows={5} value={answer} onChange={(e) => setAnswer(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select className={inputClass} value={faqCategoryId} onChange={(e) => setFaqCategoryId(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Display order</label>
                <input type="number" min={1} className={inputClass} value={faqDisplayOrder} onChange={(e) => setFaqDisplayOrder(Number(e.target.value) || 1)} />
                <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first on the public FAQ page</p>
              </div>
              <div>
                <label className={labelClass}>Background colour</label>
                <select className={inputClass} value={faqBackgroundColor} onChange={(e) => setFaqBackgroundColor(e.target.value)}>
                  {FAQ_BG_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">Colour of the FAQ card on the public page</p>
              </div>
              <div>
                <label className={labelClass}>Text colour</label>
                <select className={inputClass} value={faqTextColor} onChange={(e) => setFaqTextColor(e.target.value)}>
                  {FAQ_TEXT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="faq-active"
                  checked={faqIsActive}
                  onChange={(e) => setFaqIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-primary"
                />
                <label htmlFor="faq-active" className={labelClass}>
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeFaqDialog} className={btnSecondary}>
                  Cancel
                </button>
                <button type="submit" className={btnPrimary}>
                  {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
