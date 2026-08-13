'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData, uploadAdminImage, uploadAdminPdf } from '@/lib/adminApi';

interface ReportPdf {
  language: 'english' | 'dari' | 'pashto';
  url: string;
  fileName: string;
}

interface Report {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  status: 'draft' | 'published';
  publishedAt: string;
  pdfs: ReportPdf[];
}

const STATUS_COLORS: Record<Report['status'], string> = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-emerald-100 text-emerald-800',
};

const LANGUAGES: { value: ReportPdf['language']; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'dari', label: 'Dari' },
  { value: 'pashto', label: 'Pashto' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s!@#$%^&*()_+=\[\]{};:'",.<>?/\\|`~\-]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const emptyReport: Omit<Report, 'id'> = {
  title: '', slug: '', excerpt: '', content: '',
  imageUrl: '', status: 'draft',
  publishedAt: new Date().toISOString().split('T')[0],
  pdfs: [],
};

export default function ReportManagementPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [form, setForm] = useState<Omit<Report, 'id'>>(emptyReport);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [pdfLang, setPdfLang] = useState<ReportPdf['language']>('english');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadAdminData<Report[]>('reports');
    if (data) setReports(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (updated: Report[]) => {
    setSaving(true);
    const ok = await saveAdminData('reports', updated);
    if (ok) setReports(updated);
    else alert('Failed to save. Please try again.');
    setSaving(false);
  };

  const openAdd = () => {
    setEditingReport(null);
    setForm(emptyReport);
    setShowDialog(true);
  };

  const openEdit = (report: Report) => {
    setEditingReport(report);
    setForm({
      title: report.title, slug: report.slug, excerpt: report.excerpt,
      content: report.content, imageUrl: report.imageUrl,
      status: report.status, publishedAt: report.publishedAt,
      pdfs: report.pdfs || [],
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    const slug = form.slug || slugify(form.title);
    if (editingReport) {
      const updated = reports.map(r => r.id === editingReport.id ? { ...r, ...form, slug } : r);
      await save(updated);
    } else {
      const newReport: Report = { ...form, slug, id: crypto.randomUUID() };
      await save([...reports, newReport]);
    }
    setShowDialog(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await save(reports.filter(r => r.id !== deleteId));
    setDeleteId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const url = await uploadAdminImage(file, 'reports');
    if (url) setForm(f => ({ ...f, imageUrl: url }));
    else alert('Image upload failed.');
    setUploadingImage(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(pdfLang);
    const url = await uploadAdminPdf(file, 'reports');
    if (url) {
      const uploadedLang = pdfLang;
      setForm(f => {
        const newPdfs = [
          ...f.pdfs.filter(p => p.language !== uploadedLang),
          { language: uploadedLang, url, fileName: file.name },
        ];
        const remaining = LANGUAGES.filter(l => !newPdfs.some(p => p.language === l.value));
        if (remaining.length > 0) setPdfLang(remaining[0].value);
        return { ...f, pdfs: newPdfs };
      });
    } else {
      alert('PDF upload failed.');
    }
    setUploadingPdf(null);
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  const removePdf = (language: ReportPdf['language']) => {
    setForm(f => {
      const newPdfs = f.pdfs.filter(p => p.language !== language);
      const remaining = LANGUAGES.filter(l => !newPdfs.some(p => p.language === l.value));
      if (remaining.length > 0) setPdfLang(remaining[0].value);
      return { ...f, pdfs: newPdfs };
    });
  };

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Report Management</h1>
            <p className="text-gray-600 font-body">Manage reports with multi-language PDF downloads</p>
          </div>
          <button onClick={openAdd} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white">+ Add Report</button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
            <p className="text-gray-500 text-lg font-semibold">No reports found</p>
            <p className="text-gray-400 mt-1">Create your first report to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">PDFs</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {report.imageUrl && (
                          <img src={report.imageUrl} alt="" className="h-10 w-14 object-cover rounded" />
                        )}
                        <span className="font-medium text-gray-900">{report.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${STATUS_COLORS[report.status]}`}>{report.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{report.publishedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(report.pdfs || []).map(pdf => (
                          <span key={pdf.language} className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                            {pdf.language}
                          </span>
                        ))}
                        {(!report.pdfs || report.pdfs.length === 0) && (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(report)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#725D92] hover:bg-[#635081] text-white">Edit</button>
                      <button onClick={() => setDeleteId(report.id)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#E57173] hover:bg-[#d65a5c] text-white">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowDialog(false)}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingReport ? 'Edit Report' : 'Add New Report'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Report['status'] }))}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                  <input type="date" value={form.publishedAt} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage}
                    className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50">
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Preview" className="h-12 w-16 object-cover rounded border" />
                  )}
                </div>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="Or paste image URL"
                  className="w-full mt-2 rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea rows={6} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>

              {/* PDF Uploads */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PDF Downloads (Multi-Language)</label>
                <div className="space-y-3">
                  {/* Existing PDFs */}
                  {form.pdfs.map(pdf => (
                    <div key={pdf.language} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-3 py-2">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        </svg>
                        <span className="text-sm font-medium capitalize">{pdf.language}</span>
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{pdf.fileName}</span>
                      </div>
                      <button type="button" onClick={() => removePdf(pdf.language)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                    </div>
                  ))}

                  {/* Upload new PDF */}
                  <div className="flex items-center gap-2">
                    <select value={pdfLang} onChange={e => setPdfLang(e.target.value as ReportPdf['language'])}
                      className="rounded-none border-2 border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#725D92] outline-none">
                      {LANGUAGES.filter(l => !form.pdfs.some(p => p.language === l.value)).map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                    <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                    <button type="button" onClick={() => pdfInputRef.current?.click()}
                      disabled={uploadingPdf !== null || form.pdfs.length >= 3}
                      className="rounded-none font-semibold text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                      {uploadingPdf ? `Uploading ${uploadingPdf}...` : 'Upload PDF'}
                    </button>
                  </div>
                  {form.pdfs.length >= 3 && (
                    <p className="text-xs text-gray-500">All languages have PDFs uploaded.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDialog(false)} className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
              <button onClick={handleSubmit} disabled={saving} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white disabled:opacity-50">
                {saving ? 'Saving...' : editingReport ? 'Update Report' : 'Create Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this report? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
              <button onClick={handleDelete} disabled={saving} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#E57173] hover:bg-[#d65a5c] text-white disabled:opacity-50">
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
