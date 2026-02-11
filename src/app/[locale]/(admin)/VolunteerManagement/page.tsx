'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

/* ---------- Interfaces ---------- */
interface VolunteerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  areasOfInterest: string;
  hoursPerWeek: number;
  message: string;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  submittedAt: string;
}

interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  colorClass: string;
  iconName: string;
  isActive: boolean;
}

interface PageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  showRoles: boolean;
  showTestimonials: boolean;
  showForm: boolean;
}

interface VolunteerData {
  roles: VolunteerRole[];
  pageContent: PageContent;
}

/* ---------- Constants ---------- */
type TabId = 'applications' | 'roles' | 'content';

const APP_STATUS_OPTIONS: VolunteerApplication['status'][] = ['new', 'reviewed', 'accepted', 'rejected'];

const APP_STATUS_COLORS: Record<VolunteerApplication['status'], string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

const defaultPageContent: PageContent = {
  heroTitle: '', heroSubtitle: '', heroImageUrl: '',
  showRoles: true, showTestimonials: true, showForm: true,
};

const ROLE_COLOR_OPTIONS = [
  { value: 'bg-wrf-purple', label: 'Purple' },
  { value: 'bg-wrf-coral', label: 'Coral / Red' },
  { value: 'bg-wrf-black', label: 'Black' },
];
const ROLE_ICON_OPTIONS = [
  { value: 'calendar', label: 'Calendar' },
  { value: 'megaphone', label: 'Megaphone' },
  { value: 'book', label: 'Book' },
  { value: 'target', label: 'Target' },
  { value: 'users', label: 'Users' },
  { value: 'heart', label: 'Heart' },
];

const emptyRole: Omit<VolunteerRole, 'id'> = { title: '', description: '', colorClass: 'bg-wrf-purple', iconName: 'users', isActive: true };

export default function VolunteerManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>('applications');

  /* Applications state */
  const [apps, setApps] = useState<VolunteerApplication[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [appSaving, setAppSaving] = useState(false);
  const [appFilter, setAppFilter] = useState<string>('all');
  const [viewApp, setViewApp] = useState<VolunteerApplication | null>(null);

  /* Roles & page content state */
  const [volData, setVolData] = useState<VolunteerData>({ roles: [], pageContent: defaultPageContent });
  const [volLoading, setVolLoading] = useState(true);
  const [volSaving, setVolSaving] = useState(false);
  const [roleDialog, setRoleDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<VolunteerRole | null>(null);
  const [roleForm, setRoleForm] = useState(emptyRole);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  /* ---------- Loaders ---------- */
  const loadApps = useCallback(async () => {
    setAppLoading(true);
    const data = await loadAdminData<VolunteerApplication[]>('volunteer-applications');
    if (data) setApps(data);
    setAppLoading(false);
  }, []);

  const loadVol = useCallback(async () => {
    setVolLoading(true);
    const data = await loadAdminData<VolunteerData>('volunteers');
    if (data) setVolData({ roles: data.roles || [], pageContent: { ...defaultPageContent, ...data.pageContent } });
    setVolLoading(false);
  }, []);

  useEffect(() => { loadApps(); loadVol(); }, [loadApps, loadVol]);

  /* ---------- Application actions ---------- */
  const saveApps = async (updated: VolunteerApplication[]) => {
    setAppSaving(true);
    const ok = await saveAdminData('volunteer-applications', updated);
    if (ok) setApps(updated);
    else alert('Failed to save.');
    setAppSaving(false);
  };

  const updateAppStatus = async (id: string, status: VolunteerApplication['status']) => {
    await saveApps(apps.map(a => a.id === id ? { ...a, status } : a));
  };

  /* ---------- Volunteer data save ---------- */
  const saveVol = async (data: VolunteerData) => {
    setVolSaving(true);
    const ok = await saveAdminData('volunteers', data);
    if (ok) setVolData(data);
    else alert('Failed to save.');
    setVolSaving(false);
  };

  /* ---------- Role actions ---------- */
  const openAddRole = () => { setEditingRole(null); setRoleForm(emptyRole); setRoleDialog(true); };
  const openEditRole = (r: VolunteerRole) => { setEditingRole(r); setRoleForm({ title: r.title, description: r.description, colorClass: r.colorClass || 'bg-wrf-purple', iconName: r.iconName || 'users', isActive: r.isActive }); setRoleDialog(true); };

  const handleRoleSubmit = async () => {
    if (!roleForm.title.trim()) { alert('Title is required'); return; }
    if (editingRole) {
      await saveVol({ ...volData, roles: volData.roles.map(r => r.id === editingRole.id ? { ...r, ...roleForm } : r) });
    } else {
      await saveVol({ ...volData, roles: [...volData.roles, { ...roleForm, id: crypto.randomUUID() }] });
    }
    setRoleDialog(false);
  };

  const handleDeleteRole = async () => {
    if (!deleteRoleId) return;
    await saveVol({ ...volData, roles: volData.roles.filter(r => r.id !== deleteRoleId) });
    setDeleteRoleId(null);
  };

  /* ---------- Page content ---------- */
  const pc = volData.pageContent;
  const setPc = (patch: Partial<PageContent>) => setVolData(d => ({ ...d, pageContent: { ...d.pageContent, ...patch } }));

  const filteredApps = appFilter === 'all' ? apps : apps.filter(a => a.status === appFilter);

  const TABS: { id: TabId; label: string }[] = [
    { id: 'applications', label: `Applications (${apps.length})` },
    { id: 'roles', label: `Roles (${volData.roles.length})` },
    { id: 'content', label: 'Page Content' },
  ];

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Volunteer Management</h1>
          <p className="text-gray-600 font-body">Manage volunteer applications, roles, and page content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === tab.id ? 'border-[#725D92] text-[#725D92]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {['all', ...APP_STATUS_OPTIONS].map(s => (
                <button key={s} onClick={() => setAppFilter(s)}
                  className={`rounded-none font-semibold text-sm px-4 py-2 capitalize ${appFilter === s ? 'bg-[#725D92] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {s === 'all' ? `All (${apps.length})` : `${s} (${apps.filter(a => a.status === s).length})`}
                </button>
              ))}
            </div>

            {appLoading ? <p className="text-gray-500">Loading...</p> : filteredApps.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
                <p className="text-gray-500 text-lg font-semibold">No applications found</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Areas of Interest</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Hours/wk</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredApps.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{a.fullName}</td>
                        <td className="px-4 py-3 text-gray-600">{a.email}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{a.areasOfInterest}</td>
                        <td className="px-4 py-3 text-gray-600">{a.hoursPerWeek}</td>
                        <td className="px-4 py-3">
                          <select value={a.status} disabled={appSaving}
                            onChange={e => updateAppStatus(a.id, e.target.value as VolunteerApplication['status'])}
                            className={`rounded-none border-2 border-gray-200 px-2 py-1 text-xs font-semibold focus:ring-2 focus:ring-[#725D92] outline-none ${APP_STATUS_COLORS[a.status]}`}>
                            {APP_STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-white text-gray-900">{o}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{a.submittedAt}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setViewApp(a)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#725D92] hover:bg-[#635081] text-white">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Roles */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={openAddRole} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white">+ Add Role</button>
            </div>
            {volLoading ? <p className="text-gray-500">Loading...</p> : volData.roles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
                <p className="text-gray-500 text-lg font-semibold">No roles defined</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {volData.roles.map(role => (
                  <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{role.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${role.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => openEditRole(role)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#725D92] hover:bg-[#635081] text-white">Edit</button>
                      <button onClick={() => setDeleteRoleId(role.id)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#E57173] hover:bg-[#d65a5c] text-white">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Page Content */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {volLoading ? <p className="text-gray-500">Loading...</p> : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-bold">Hero Section</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input value={pc.heroTitle} onChange={e => setPc({ heroTitle: e.target.value })}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <input value={pc.heroSubtitle} onChange={e => setPc({ heroSubtitle: e.target.value })}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                  <input value={pc.heroImageUrl} onChange={e => setPc({ heroImageUrl: e.target.value })}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
                </div>
                <h2 className="text-lg font-bold pt-4">Section Visibility</h2>
                <div className="space-y-3">
                  {[
                    { key: 'showRoles' as const, label: 'Show Volunteer Roles Section' },
                    { key: 'showTestimonials' as const, label: 'Show Testimonials Section' },
                    { key: 'showForm' as const, label: 'Show Application Form Section' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={pc[key]} onChange={e => setPc({ [key]: e.target.checked })}
                        className="w-4 h-4 text-[#725D92] rounded" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={() => saveVol(volData)} disabled={volSaving}
                    className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white disabled:opacity-50">
                    {volSaving ? 'Saving...' : 'Save Page Content'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Application Dialog */}
      {viewApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewApp(null)}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Volunteer Application</h2>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${APP_STATUS_COLORS[viewApp.status]}`}>{viewApp.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-500">Name</label><p className="text-gray-900">{viewApp.fullName}</p></div>
              <div><label className="block text-sm font-medium text-gray-500">Email</label><p className="text-gray-900">{viewApp.email}</p></div>
              <div><label className="block text-sm font-medium text-gray-500">Phone</label><p className="text-gray-900">{viewApp.phone || '—'}</p></div>
              <div><label className="block text-sm font-medium text-gray-500">Hours/week</label><p className="text-gray-900">{viewApp.hoursPerWeek}</p></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-500">Areas of Interest</label><p className="text-gray-900">{viewApp.areasOfInterest}</p></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-500">Message</label><p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200 mt-1">{viewApp.message || 'No message.'}</p></div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setViewApp(null)} className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Role Add/Edit Dialog */}
      {roleDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setRoleDialog(false)}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingRole ? 'Edit Role' : 'Add New Role'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={roleForm.title} onChange={e => setRoleForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={roleForm.description} onChange={e => setRoleForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Color</label>
                  <select value={roleForm.colorClass} onChange={e => setRoleForm(f => ({ ...f, colorClass: e.target.value }))}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none">
                    {ROLE_COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select value={roleForm.iconName} onChange={e => setRoleForm(f => ({ ...f, iconName: e.target.value }))}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none">
                    {ROLE_ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={roleForm.isActive} onChange={e => setRoleForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#725D92] rounded" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setRoleDialog(false)} className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
              <button onClick={handleRoleSubmit} disabled={volSaving} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white disabled:opacity-50">
                {volSaving ? 'Saving...' : editingRole ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Confirmation */}
      {deleteRoleId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteRoleId(null)}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this role?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteRoleId(null)} className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
              <button onClick={handleDeleteRole} disabled={volSaving} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#E57173] hover:bg-[#d65a5c] text-white disabled:opacity-50">
                {volSaving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
