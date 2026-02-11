'use client';

import { useState, useEffect } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const SvgPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const SvgTrash = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const SvgVenetianMask = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
    <path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" />
    <path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" />
  </svg>
);

type SocialLink = {
  label: string;
  href: string;
  icon: string;
};

type Founder = {
  id: string;
  name: string;
  title: string;
  imageUrl?: string;
  iconBg?: string;
  bio?: string;
  expertise?: string[];
  links?: SocialLink[];
};

const SOCIAL_ICON_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'globe', label: 'Website' },
  { value: 'mail', label: 'Email' },
];

const defaultFounders: Founder[] = [
  {
    id: '1',
    name: 'Shabnam Salehi',
    title: 'Co-Founder & President',
    iconBg: 'bg-wrf-purple',
    bio: '',
    expertise: [],
    links: [],
  },
  {
    id: '2',
    name: 'Hanifa Girowal',
    title: 'Co-Founder & VP',
    iconBg: 'bg-wrf-coral',
    bio: '',
    expertise: [],
    links: [],
  },
];

const inputClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
const textareaClass =
  'flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y';
const labelClass = 'block text-sm font-medium mb-2';
const btnPrimary =
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 px-3 py-2 bg-primary hover:bg-primary/90';
const btnSecondary =
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2';
const btnDestructive =
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-3 py-2 bg-red-600 text-white hover:bg-red-700';

export default function FounderManagementPage() {
  const [founders, setFounders] = useState<Founder[]>(defaultFounders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIconBg, setFormIconBg] = useState('bg-wrf-purple');
  const [formBio, setFormBio] = useState('');
  const [formExpertise, setFormExpertise] = useState<string[]>([]);
  const [formNewExpertise, setFormNewExpertise] = useState('');
  const [formLinks, setFormLinks] = useState<SocialLink[]>([]);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    loadAdminData<{ founders: Founder[] }>('founders').then((data) => {
      if (data?.founders) setFounders(data.founders);
    });
  }, []);

  const persist = async (updatedFounders: Founder[]) => {
    setSaveStatus('saving');
    const ok = await saveAdminData('founders', { founders: updatedFounders });
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const resetForm = () => {
    setFormName('');
    setFormTitle('');
    setFormImageUrl('');
    setFormIconBg('bg-wrf-purple');
    setFormBio('');
    setFormExpertise([]);
    setFormNewExpertise('');
    setFormLinks([]);
  };

  const openAdd = () => {
    setEditingId(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (f: Founder) => {
    setEditingId(f.id);
    setFormName(f.name);
    setFormTitle(f.title);
    setFormImageUrl(f.imageUrl ?? '');
    setFormIconBg(f.iconBg ?? 'bg-wrf-purple');
    setFormBio(f.bio ?? '');
    setFormExpertise(f.expertise ?? []);
    setFormNewExpertise('');
    setFormLinks(f.links ?? []);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  // Expertise helpers
  const addExpertise = () => {
    const trimmed = formNewExpertise.trim();
    if (trimmed && !formExpertise.includes(trimmed)) {
      setFormExpertise([...formExpertise, trimmed]);
      setFormNewExpertise('');
    }
  };

  const removeExpertise = (tag: string) => {
    setFormExpertise(formExpertise.filter((e) => e !== tag));
  };

  // Social link helpers
  const addSocialLink = () => {
    setFormLinks([...formLinks, { label: 'LinkedIn', href: '', icon: 'linkedin' }]);
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...formLinks];
    updated[index] = { ...updated[index], [field]: value };
    // Sync label with icon selection
    if (field === 'icon') {
      const option = SOCIAL_ICON_OPTIONS.find((o) => o.value === value);
      if (option) updated[index].label = option.label;
    }
    setFormLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setFormLinks(formLinks.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const founderData: Founder = {
      id: editingId ?? String(Date.now()),
      name: formName,
      title: formTitle,
      imageUrl: formImageUrl || undefined,
      iconBg: formIconBg,
      bio: formBio,
      expertise: formExpertise,
      links: formLinks,
    };

    let updatedFounders: Founder[];
    if (editingId) {
      updatedFounders = founders.map((f) => (f.id === editingId ? founderData : f));
    } else {
      updatedFounders = [...founders, founderData];
    }
    setFounders(updatedFounders);
    persist(updatedFounders);
    closeDialog();
  };

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Delete this founder?')) {
      const updatedFounders = founders.filter((f) => f.id !== id);
      setFounders(updatedFounders);
      persist(updatedFounders);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Founder Management</h1>
            <p className="text-gray-600 font-body">Manage founder profiles for your organization</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && <span className="text-sm text-gray-500">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-green-600">Saved!</span>}
            {saveStatus === 'error' && <span className="text-sm text-red-600">Save failed</span>}
            <button
              type="button"
              className={btnPrimary}
              aria-haspopup="dialog"
              aria-expanded={dialogOpen}
              onClick={openAdd}
            >
              <SvgPlus className="w-4 h-4 mr-2" />
              Add New Founder
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {founders.map((founder) => (
            <div
              key={founder.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-4 flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 flex-shrink-0 flex items-center justify-center overflow-hidden rounded ${
                      founder.imageUrl ? 'bg-gray-100' : founder.iconBg === 'bg-wrf-coral' ? 'bg-wrf-coral' : 'bg-wrf-purple'
                    }`}
                  >
                    {founder.imageUrl ? (
                      <img src={founder.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <SvgVenetianMask className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold">{founder.name}</h3>
                    <p className="text-sm text-gray-600">{founder.title}</p>
                    {founder.bio && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{founder.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {founder.expertise?.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {founder.links && founder.links.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {founder.links.map((l) => l.label).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button type="button" className={btnSecondary} onClick={() => openEdit(founder)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className={btnDestructive}
                    onClick={() => handleDelete(founder.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="founder-dialog-title"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={closeDialog} />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border bg-background p-6 shadow-lg mx-4">
            <h2 id="founder-dialog-title" className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Founder' : 'Add New Founder'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Founder name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Title / Role */}
              <div>
                <label className={labelClass}>Title / Role</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Co-Founder & President"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className={labelClass}>Image URL</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                />
              </div>

              {/* Background color */}
              <div>
                <label className={labelClass}>Card Background Color</label>
                <select
                  className={inputClass}
                  value={formIconBg}
                  onChange={(e) => setFormIconBg(e.target.value)}
                >
                  <option value="bg-wrf-purple">Purple</option>
                  <option value="bg-wrf-coral">Coral / Red</option>
                  <option value="bg-wrf-black">Black</option>
                  <option value="bg-wrf-footer-mauve">Mauve</option>
                </select>
              </div>

              {/* Bio / About */}
              <div>
                <label className={labelClass}>About / Biography *</label>
                <textarea
                  className={textareaClass}
                  placeholder="Write a detailed biography for this founder..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  required
                />
              </div>

              {/* Areas of Expertise */}
              <div>
                <label className={labelClass}>Areas of Expertise</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formExpertise.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded bg-gray-100 px-2.5 py-1 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-gray-400 hover:text-red-500"
                        onClick={() => removeExpertise(tag)}
                        aria-label={`Remove ${tag}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Gender Equality"
                    value={formNewExpertise}
                    onChange={(e) => setFormNewExpertise(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExpertise();
                      }
                    }}
                  />
                  <button type="button" className={btnSecondary} onClick={addExpertise}>
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to add each tag</p>
              </div>

              {/* Social Links */}
              <div>
                <label className={labelClass}>Social Links</label>
                <div className="space-y-3 mb-2">
                  {formLinks.map((link, index) => (
                    <div key={index} className="flex items-start gap-2 rounded border border-gray-200 p-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
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
                        <input
                          type="url"
                          className={inputClass}
                          placeholder={link.icon === 'mail' ? 'mailto:name@example.com' : 'https://...'}
                          value={link.href}
                          onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="mt-1 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeSocialLink(index)}
                        aria-label="Remove link"
                      >
                        <SvgTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className={btnSecondary} onClick={addSocialLink}>
                  <SvgPlus className="w-4 h-4 mr-1" />
                  Add Social Link
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-2 border-t">
                <button type="button" className={btnSecondary} onClick={closeDialog}>
                  Cancel
                </button>
                <button type="submit" className={btnPrimary}>
                  {editingId ? 'Save Changes' : 'Add Founder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
