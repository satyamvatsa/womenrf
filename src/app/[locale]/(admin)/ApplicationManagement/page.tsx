'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  resumeUrl: string;
  status: 'new' | 'reviewed' | 'interview' | 'hired' | 'rejected';
  submittedAt: string;
}

const STATUS_OPTIONS: JobApplication['status'][] = ['new', 'reviewed', 'interview', 'hired', 'rejected'];

const STATUS_COLORS: Record<JobApplication['status'], string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

const FILTER_TABS = ['all', ...STATUS_OPTIONS] as const;

function formatSubmittedAt(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function ApplicationManagementPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewApp, setViewApp] = useState<JobApplication | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadAdminData<JobApplication[] | Record<string, unknown>>('job-applications');
    setApplications(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (updated: JobApplication[]) => {
    setSaving(true);
    const ok = await saveAdminData('job-applications', updated);
    if (ok) setApplications(updated);
    else alert('Failed to save. Please try again.');
    setSaving(false);
  };

  const updateStatus = async (id: string, status: JobApplication['status']) => {
    const updated = applications.map(a => a.id === id ? { ...a, status } : a);
    await save(updated);
  };

  const filtered = filterStatus === 'all' ? applications : applications.filter(a => a.status === filterStatus);

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Application Management</h1>
          <p className="text-gray-600 font-body">Review and manage job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STATUS_OPTIONS.map(s => (
            <div key={s} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-500 capitalize">{s}</p>
              <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === s).length}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`rounded-none font-semibold text-sm px-4 py-2 capitalize ${filterStatus === s ? 'bg-[#725D92] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {s === 'all' ? `All (${applications.length})` : `${s} (${applications.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? <p className="text-gray-500">Loading...</p> : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
            <p className="text-gray-500 text-lg font-semibold">No applications found</p>
            <p className="text-gray-400 mt-1">Applications will appear here when candidates apply</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Position</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{app.fullName}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{app.position}</td>
                    <td className="px-4 py-3">
                      <select value={app.status} disabled={saving}
                        onChange={e => updateStatus(app.id, e.target.value as JobApplication['status'])}
                        className={`rounded-none border-2 border-gray-200 px-2 py-1 text-xs font-semibold focus:ring-2 focus:ring-[#725D92] outline-none ${STATUS_COLORS[app.status]}`}>
                        {STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-white text-gray-900">{o}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatSubmittedAt(app.submittedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setViewApp(app)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#725D92] hover:bg-[#635081] text-white">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Dialog */}
      {viewApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewApp(null)}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Application Details</h2>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${STATUS_COLORS[viewApp.status]}`}>{viewApp.status}</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">{viewApp.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{viewApp.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{viewApp.phone || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Position</label>
                  <p className="text-gray-900">{viewApp.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Submitted</label>
                  <p className="text-gray-900">{formatSubmittedAt(viewApp.submittedAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Resume</label>
                  {viewApp.resumeUrl ? (
                    <a href={viewApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[#725D92] underline">View Resume</a>
                  ) : <p className="text-gray-400">Not provided</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Cover Letter</label>
                <p className="text-gray-900 whitespace-pre-wrap mt-1 bg-gray-50 p-3 rounded border border-gray-200">{viewApp.coverLetter || 'No cover letter provided.'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Update Status</label>
                <select value={viewApp.status} disabled={saving}
                  onChange={async e => {
                    const newStatus = e.target.value as JobApplication['status'];
                    await updateStatus(viewApp.id, newStatus);
                    setViewApp({ ...viewApp, status: newStatus });
                  }}
                  className="rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none">
                  {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setViewApp(null)} className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
