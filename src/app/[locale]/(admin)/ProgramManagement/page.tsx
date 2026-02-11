'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

type Program = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  heroImageUrl: string;
  slug: string;
  status: 'active' | 'draft';
  featured: boolean;
};

const initialPrograms: Program[] = [
  {
    id: '1',
    title: 'Peacebuilding and Social Cohesion',
    shortDescription:
      "Fostering dialogue, understanding, and unity across communities to build lasting peace and strengthen social bonds in conflict-affected regions.",
    longDescription: '',
    heroImageUrl: '',
    slug: 'peacebuilding-social-cohesion',
    status: 'active',
    featured: true,
  },
  {
    id: '2',
    title: "Legal Empowerment & International Accountability",
    shortDescription:
      "Strengthening legal frameworks and accountability mechanisms to protect women's rights in Afghanistan and internationally.",
    longDescription: '',
    heroImageUrl: '',
    slug: 'legal-empowerment-international-accountability',
    status: 'active',
    featured: true,
  },
  {
    id: '3',
    title: 'Digital Transformation and Open Gender Data',
    shortDescription:
      "Women's Rights First leverages digital tools and open gender data to counter the erasure of Afghan women in real time. Through secure, survivor-led documentation, we transform raw testimonies into verified data that informs international accountability mechanisms and policy responses. Our goal is to build an open, future-proof feminist data ecosystem that protects evidence, strengthens legal action, and ensures Afghan women remain visible, countable, and impossible to ignore.",
    longDescription: '',
    heroImageUrl: '',
    slug: 'digital-transformation-open-gender-data',
    status: 'active',
    featured: true,
  },
  {
    id: '4',
    title: 'Representation and Advocacy',
    shortDescription:
      "Amplifying Afghan women's voices on national and international platforms, advocating for policy change and rights protection.",
    longDescription: '',
    heroImageUrl: '',
    slug: 'representation-advocacy',
    status: 'active',
    featured: true,
  },
];

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-4 h-4 mr-2">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen w-4 h-4">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 w-4 h-4">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-3 h-3 mr-1">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ProgramManagementPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const base = `/${locale}`;

  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingProgram = editingId ? programs.find((p) => p.id === editingId) : null;
  const isCreate = !editingId;

  const [formTitle, setFormTitle] = useState('');
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formHeroImageUrl, setFormHeroImageUrl] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'draft'>('active');
  const [formFeatured, setFormFeatured] = useState(false);

  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    loadAdminData<{ programs: Program[] }>('programs').then(data => {
      if (!data) return;
      if (data.programs !== undefined) setPrograms(data.programs);
    });
  }, []);

  const persistPrograms = async (updatedPrograms: typeof programs) => {
    setSaveStatus('saving');
    const ok = await saveAdminData('programs', { programs: updatedPrograms });
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormTitle('');
    setFormShortDescription('');
    setFormLongDescription('');
    setFormHeroImageUrl('');
    setFormSlug('');
    setFormStatus('active');
    setFormFeatured(false);
    setDialogOpen(true);
  };

  const openEdit = (program: Program) => {
    setEditingId(program.id);
    setFormTitle(program.title);
    setFormShortDescription(program.shortDescription);
    setFormLongDescription(program.longDescription || '');
    setFormHeroImageUrl(program.heroImageUrl || '');
    setFormSlug(program.slug);
    setFormStatus(program.status);
    setFormFeatured(program.featured);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const handleSubmitProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formSlug.trim() || slugFromTitle(formTitle);
    let updatedPrograms: Program[];
    if (isCreate) {
      updatedPrograms = [
        ...programs,
        {
          id: String(Date.now()),
          title: formTitle.trim(),
          shortDescription: formShortDescription.trim(),
          longDescription: formLongDescription.trim(),
          heroImageUrl: formHeroImageUrl.trim(),
          slug,
          status: formStatus,
          featured: formFeatured,
        },
      ];
    } else if (editingId) {
      updatedPrograms = programs.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: formTitle.trim(),
              shortDescription: formShortDescription.trim(),
              longDescription: formLongDescription.trim(),
              heroImageUrl: formHeroImageUrl.trim(),
              slug,
              status: formStatus,
              featured: formFeatured,
            }
          : p
      );
    } else {
      updatedPrograms = programs;
    }
    setPrograms(updatedPrograms);
    closeDialog();
    await persistPrograms(updatedPrograms);
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Delete this program? This cannot be undone.')) {
      const updatedPrograms = programs.filter((p) => p.id !== id);
      setPrograms(updatedPrograms);
      await persistPrograms(updatedPrograms);
    }
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const textareaClass =
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Program Management</h1>
            <p className="text-gray-600 font-body">Create and manage detailed program pages</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            aria-haspopup="dialog"
            aria-expanded={dialogOpen}
            className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2 bg-secondary"
          >
            <PlusIcon />
            Create New Program
          </button>
          {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
          {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
        </div>

        <div className="grid gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 font-body mt-1 line-clamp-2">{program.shortDescription}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-secondary text-white">
                        {program.status}
                      </span>
                      {program.featured && (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-accent text-white">
                          Featured
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                        <EyeIcon />
                        Active
                      </span>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">
                        URL: /ProgramPage?slug={program.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(program)}
                      className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >
                      <PenIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(program.id)}
                      className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:text-accent-foreground h-9 rounded-md px-3 text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="program-dialog-title"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 id="program-dialog-title" className="text-xl font-semibold font-heading text-primary mb-4">
                {isCreate ? 'Create New Program' : 'Edit Program'}
              </h2>
              <form onSubmit={handleSubmitProgram} className="space-y-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    className={inputClass + ' mt-1'}
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (isCreate && !formSlug) setFormSlug(slugFromTitle(e.target.value));
                    }}
                    placeholder="Program title"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Short description</label>
                  <textarea
                    className={textareaClass + ' mt-1'}
                    value={formShortDescription}
                    onChange={(e) => setFormShortDescription(e.target.value)}
                    placeholder="Brief description for the card"
                    rows={3}
                  />
                </div>
                <div>
                  <label className={labelClass}>Full description (HTML enabled)</label>
                  <textarea
                    className={textareaClass + ' mt-1'}
                    value={formLongDescription}
                    onChange={(e) => setFormLongDescription(e.target.value)}
                    placeholder="Detailed program description for the program page..."
                    rows={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">Existing programs use default translated content. New programs will use this description.</p>
                </div>
                <div>
                  <label className={labelClass}>Hero Image URL</label>
                  <input
                    type="url"
                    className={inputClass + ' mt-1'}
                    value={formHeroImageUrl}
                    onChange={(e) => setFormHeroImageUrl(e.target.value)}
                    placeholder="https://example.com/program-hero.jpg"
                  />
                </div>
                <div>
                  <label className={labelClass}>URL slug</label>
                  <input
                    type="text"
                    className={inputClass + ' mt-1'}
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="program-slug (auto from title if empty)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used in /ProgramPage?slug=...</p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === 'active'}
                      onChange={() => setFormStatus('active')}
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === 'draft'}
                      onChange={() => setFormStatus('draft')}
                    />
                    <span className="text-sm">Draft</span>
                  </label>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                  />
                  <span className="text-sm font-medium">Featured</span>
                </label>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-primary-foreground hover:bg-secondary/90 h-9 px-4"
                  >
                    {isCreate ? 'Create' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
