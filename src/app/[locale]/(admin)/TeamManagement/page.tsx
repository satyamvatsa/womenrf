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

const SvgTrash2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
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

const SvgX = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const CATEGORY_COLOR_OPTIONS = [
  { value: 'bg-primary', label: 'Primary (Dark)' },
  { value: 'bg-secondary', label: 'Secondary' },
  { value: 'bg-accent', label: 'Accent' },
  { value: 'bg-support-1', label: 'Support' },
];

type Category = { id: string; name: string; description: string; colorClass: string };
type TeamMember = {
  id: string;
  name: string;
  role: string;
  categoryId: string;
  imageUrl: string;
  bio: string;
  linkedinUrl: string;
  email: string;
};

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Board of Directors', description: '', colorClass: 'bg-secondary' },
  { id: 'cat-2', name: 'Management Team', description: '', colorClass: 'bg-secondary' },
];

const defaultMembers: TeamMember[] = [
  {
    id: 'm-1',
    name: 'Morten Kjaerum',
    role: 'Board Member',
    categoryId: 'cat-1',
    imageUrl: '/images/1-Panelist-Morten-Kjaerum-Picture-1.jpg',
    bio: 'Morten Kjaerum is an Adjunct professor at the University of Aalborg, Denmark and an affiliated scholar at The Raoul Wallenberg Institute (RWI), Sweden. 2015 -2024 Director the RWI, 2008-15: director the EU Agency for Fundamental Rights, 1991-2008: Director, the Danish Institute for Human Rights; Member of the UN Committee on the Elimination of Racial Discrimination 2002-08. 2018-2020 Chair the Board of Trustees for the United Nations Voluntary Fund for Technical Cooperation in the Field of Human Rights (VFTC) and of the UPR Trust Fund for Financial and Technical Assistance. From 2015-23 he was chair of the European Council for Refugees and Exiles (ECRE). He has written extensively on human rights issues and lectured at universities across continents.',
    linkedinUrl: 'https://www.linkedin.com/in/morten-kjaerum-434b6a2',
    email: '',
  },
];

export default function TeamManagementPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [members, setMembers] = useState<TeamMember[]>(defaultMembers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-primary');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberCategoryId, setMemberCategoryId] = useState('');
  const [memberImageUrl, setMemberImageUrl] = useState('');
  const [memberBio, setMemberBio] = useState('');
  const [memberLinkedinUrl, setMemberLinkedinUrl] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  useEffect(() => {
    loadAdminData<{ categories: Category[]; members: TeamMember[] }>('team').then(data => {
      if (data?.categories) setCategories(data.categories);
      if (data?.members) setMembers(data.members);
    });
  }, []);

  const persist = async (updatedCategories: Category[], updatedMembers: TeamMember[]) => {
    setSaveStatus('saving');
    const ok = await saveAdminData('team', { categories: updatedCategories, members: updatedMembers });
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const openAddMember = () => {
    setEditingMemberId(null);
    setMemberName('');
    setMemberRole('');
    setMemberCategoryId(categories[0]?.id ?? '');
    setMemberImageUrl('');
    setMemberBio('');
    setMemberLinkedinUrl('');
    setMemberEmail('');
    setDialogOpen(true);
  };

  const openEditMember = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setMemberName(m.name);
    setMemberRole(m.role);
    setMemberCategoryId(m.categoryId);
    setMemberImageUrl(m.imageUrl || '');
    setMemberBio(m.bio || '');
    setMemberLinkedinUrl(m.linkedinUrl || '');
    setMemberEmail(m.email || '');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingMemberId(null);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    const memberData = {
      name: memberName,
      role: memberRole,
      categoryId: memberCategoryId,
      imageUrl: memberImageUrl,
      bio: memberBio,
      linkedinUrl: memberLinkedinUrl,
      email: memberEmail,
    };
    let updatedMembers: TeamMember[];
    if (editingMemberId) {
      updatedMembers = members.map((m) =>
        m.id === editingMemberId ? { ...m, ...memberData } : m
      );
    } else {
      updatedMembers = [
        ...members,
        { id: 'm-' + Date.now(), ...memberData },
      ];
    }
    setMembers(updatedMembers);
    persist(categories, updatedMembers);
    closeDialog();
  };

  const handleDeleteMember = (id: string) => {
    const updatedMembers = members.filter((m) => m.id !== id);
    setMembers(updatedMembers);
    persist(categories, updatedMembers);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const id = 'cat-' + Date.now();
    const updatedCategories = [...categories, { id, name: newCategoryName.trim(), description: newCategoryDescription.trim(), colorClass: newCategoryColor }];
    setCategories(updatedCategories);
    persist(updatedCategories, members);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryColor('bg-primary');
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter((c) => c.id !== id);
    const updatedMembers = members.filter((m) => m.categoryId !== id);
    setCategories(updatedCategories);
    setMembers(updatedMembers);
    persist(updatedCategories, updatedMembers);
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
  const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const cardClass = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const btnPrimary =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 px-3 py-2 bg-primary hover:bg-primary/90';
  const btnSecondary =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3';
  const btnDestructive =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-red-600 text-white hover:bg-red-700 h-9 px-3 py-2';

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Team Management</h1>
            <p className="text-gray-600 font-body">Manage team member profiles and categories</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && <span className="text-sm text-gray-500">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-green-600">Saved!</span>}
            {saveStatus === 'error' && <span className="text-sm text-red-600">Save failed</span>}
            <button
              type="button"
              onClick={openAddMember}
              className={btnPrimary}
              aria-haspopup="dialog"
              aria-expanded={dialogOpen}
            >
              <SvgPlus className="w-4 h-4 mr-2" />
              Add New Member
            </button>
          </div>
        </div>

        {/* Manage Categories */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Manage Categories</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-2 mb-4">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 ${cat.colorClass}`} />
                    <span>{cat.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className={btnSecondary}
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <SvgTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className={inputClass}
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                />
                <select
                  className={`${inputClass} w-[180px]`}
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                >
                  {CATEGORY_COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddCategory} className={btnPrimary}>
                  Add
                </button>
              </div>
              <input
                type="text"
                className={inputClass}
                placeholder="Category description (optional, shown on frontend)"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Team members by category */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const categoryMembers = members.filter((m) => m.categoryId === cat.id);
            return (
              <div key={cat.id}>
                <h2 className="text-xl font-bold mb-2">{cat.name}</h2>
                <div className="space-y-2">
                  {categoryMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No members in this category.</p>
                  ) : (
                    categoryMembers.map((member) => (
                      <div key={member.id} className={cardClass}>
                        <div className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            {member.imageUrl ? (
                              <img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary">
                                <SvgUsers className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              {member.bio && <p className="text-xs text-gray-400 mt-1 max-w-md truncate">{member.bio}</p>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => openEditMember(member)} className={btnSecondary}>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(member.id)}
                              className={btnDestructive}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Member Dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="member-dialog-title"
        >
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 id="member-dialog-title" className="text-xl font-semibold">
                {editingMemberId ? 'Edit Member' : 'Add New Member'}
              </h2>
              <button
                type="button"
                onClick={closeDialog}
                className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent"
                aria-label="Close"
              >
                <SvgX className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveMember} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  type="text"
                  className={inputClass}
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Role / Title</label>
                <input
                  type="text"
                  className={inputClass}
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="e.g. Board Member"
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  className={inputClass}
                  value={memberCategoryId}
                  onChange={(e) => setMemberCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Photo URL</label>
                <input
                  type="url"
                  className={inputClass}
                  value={memberImageUrl}
                  onChange={(e) => setMemberImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
                {memberImageUrl && (
                  <img src={memberImageUrl} alt="Preview" className="mt-2 h-20 w-20 rounded object-cover border" />
                )}
              </div>
              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  className={`${inputClass} h-32 resize-y`}
                  value={memberBio}
                  onChange={(e) => setMemberBio(e.target.value)}
                  placeholder="Brief biography of the team member..."
                />
              </div>
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input
                  type="url"
                  className={inputClass}
                  value={memberLinkedinUrl}
                  onChange={(e) => setMemberLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeDialog} className={btnSecondary}>
                  Cancel
                </button>
                <button type="submit" className={btnPrimary}>
                  {editingMemberId ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
