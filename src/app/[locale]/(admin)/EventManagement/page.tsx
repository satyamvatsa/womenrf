'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData, uploadAdminFile } from '@/lib/adminApi';

interface EventDocument {
  label: string;
  url: string;
  fileName: string;
}

interface EventPhoto {
  url: string;
  alt: string;
}

interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  status: 'draft' | 'published';
  publishedAt: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  image: string;
  body: string;
  topics: string[];
  department: string;
  registrationLink: string;
  documents: EventDocument[];
  gallery: EventPhoto[];
}

const STATUS_COLORS: Record<EventItem['status'], string> = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-emerald-100 text-emerald-800',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s!@#$%^&*()_+=\[\]{};:'",.<>?/\\|`~\-]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const emptyEvent: Omit<EventItem, 'id'> = {
  slug: '', title: '', subtitle: '', status: 'draft',
  publishedAt: new Date().toISOString().split('T')[0],
  date: new Date().toISOString().split('T')[0],
  endDate: '', time: '', location: '', image: '', body: '',
  topics: [], department: '', registrationLink: '',
  documents: [], gallery: [],
};

const inputClass = 'w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none';

// Mirrors MAX_IMAGE_SIZE in /api/upload.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;

/**
 * Shrink a photo in the browser before uploading it.
 *
 * Event photos come straight off a camera or phone and routinely exceed the
 * server's 5MB cap, which is what makes uploads fail. Nothing on the site
 * displays a gallery image above ~1000px wide, so the full-resolution original
 * buys nothing. Returns the file untouched when it is already small enough, or
 * when the browser cannot decode it (HEIC) — the server then explains why.
 */
async function downscaleImage(file: File): Promise<File> {
  // Vector and animated formats lose meaning when rasterised to a still JPEG.
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= MAX_IMAGE_BYTES) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState<Omit<EventItem, 'id'>>(emptyEvent);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [docLabel, setDocLabel] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadAdminData<{ events?: EventItem[] }>('events');
    if (data?.events) setEvents(data.events);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (updated: EventItem[]) => {
    setSaving(true);
    const ok = await saveAdminData('events', { events: updated });
    if (ok) setEvents(updated);
    else alert('Failed to save. Please try again.');
    setSaving(false);
    return ok;
  };

  const openAdd = () => {
    setEditingEvent(null);
    setForm(emptyEvent);
    setDocLabel('');
    setShowDialog(true);
  };

  const openEdit = (event: EventItem) => {
    setEditingEvent(event);
    setForm({ ...emptyEvent, ...event, topics: event.topics || [], documents: event.documents || [], gallery: event.gallery || [] });
    setDocLabel('');
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    if (!form.date) { alert('Event date is required'); return; }
    const slug = form.slug || slugify(form.title);
    if (events.some(e => e.slug === slug && e.id !== editingEvent?.id)) {
      alert('Another event already uses this slug. Please choose a different one.');
      return;
    }
    const ok = editingEvent
      ? await save(events.map(e => e.id === editingEvent.id ? { ...e, ...form, slug } : e))
      : await save([...events, { ...form, slug, id: crypto.randomUUID() }]);
    if (ok) setShowDialog(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await save(events.filter(e => e.id !== deleteId));
    setDeleteId(null);
  };

  const togglePublish = async (event: EventItem) => {
    const status = event.status === 'published' ? 'draft' : 'published';
    await save(events.map(e => e.id === event.id ? { ...e, status } : e));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const result = await uploadAdminFile(await downscaleImage(file), 'events');
    if ('url' in result) setForm(f => ({ ...f, image: result.url }));
    setUploadingImage(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if ('error' in result) alert(`Could not upload ${file.name}\n\n${result.error}`);
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const label = docLabel.trim() || file.name.replace(/\.pdf$/i, '');
    setUploadingDoc(true);
    const result = await uploadAdminFile(file, 'events');
    if ('url' in result) {
      setForm(f => ({ ...f, documents: [...f.documents, { label, url: result.url, fileName: file.name }] }));
      setDocLabel('');
    }
    setUploadingDoc(false);
    if (docInputRef.current) docInputRef.current.value = '';
    if ('error' in result) alert(`Could not upload ${file.name}\n\n${result.error}`);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingPhoto(true);
    const uploaded: EventPhoto[] = [];
    const failures: string[] = [];
    for (const file of files) {
      const result = await uploadAdminFile(await downscaleImage(file), 'events');
      if ('url' in result) uploaded.push({ url: result.url, alt: '' });
      else failures.push(`• ${file.name} — ${result.error}`);
    }
    if (uploaded.length > 0) setForm(f => ({ ...f, gallery: [...f.gallery, ...uploaded] }));
    // Clear the spinner before the blocking alert, or it stays stuck behind it.
    setUploadingPhoto(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (failures.length > 0) {
      alert(`${failures.length} of ${files.length} photo(s) failed to upload:\n\n${failures.join('\n')}`);
    }
  };

  const movePhoto = (index: number, delta: number) => {
    setForm(f => {
      const next = [...f.gallery];
      const target = index + delta;
      if (target < 0 || target >= next.length) return f;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...f, gallery: next };
    });
  };

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Event Management</h1>
            <p className="text-gray-600 font-body">Create events and publish them to the public Events pages</p>
          </div>
          <button onClick={openAdd} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white">+ Add Event</button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
            <p className="text-gray-500 text-lg font-semibold">No events found</p>
            <p className="text-gray-400 mt-1">Create your first event to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Event Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Media</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {event.image && <img src={event.image} alt="" className="h-10 w-14 object-cover rounded" />}
                        <div>
                          <span className="font-medium text-gray-900">{event.title}</span>
                          <p className="text-xs text-gray-400">/Events/{event.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${STATUS_COLORS[event.status] ?? STATUS_COLORS.draft}`}>{event.status || 'draft'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{event.date}</td>
                    <td className="px-4 py-3 text-gray-600">{event.location}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(event.documents || []).length > 0 && (
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">{event.documents.length} PDF</span>
                        )}
                        {(event.gallery || []).length > 0 && (
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">{event.gallery.length} photo</span>
                        )}
                        {(event.documents || []).length === 0 && (event.gallery || []).length === 0 && (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => togglePublish(event)} disabled={saving}
                        className={`rounded-none font-semibold text-sm px-3 py-1 text-white disabled:opacity-50 ${event.status === 'published' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                        {event.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => openEdit(event)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#725D92] hover:bg-[#635081] text-white">Edit</button>
                      <button onClick={() => setDeleteId(event.id)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#E57173] hover:bg-[#d65a5c] text-white">Delete</button>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle <span className="text-gray-400">(optional)</span></label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputClass} />
                <p className="mt-1 text-xs text-gray-500">Public URL: /Events/{form.slug || slugify(form.title) || '...'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as EventItem['status'] }))} className={inputClass}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Published On</label>
                  <input type="date" value={form.publishedAt} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-gray-400">(optional)</span></label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="10:00 AM - 11:15 AM EST" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="United Nations Headquarters, New York" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-gray-400">(optional)</span></label>
                  <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topics <span className="text-gray-400">(comma separated)</span></label>
                <input value={form.topics.join(', ')}
                  onChange={e => setForm(f => ({ ...f, topics: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  placeholder="Women's Rights, Human Rights, Afghanistan" className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration / External Link <span className="text-gray-400">(optional)</span></label>
                <input value={form.registrationLink} onChange={e => setForm(f => ({ ...f, registrationLink: e.target.value }))} placeholder="https://..." className={inputClass} />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image <span className="text-gray-400">(used on the events list)</span></label>
                <div className="flex items-center gap-3">
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage}
                    className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50">
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                  {form.image && <img src={form.image} alt="Preview" className="h-12 w-16 object-cover rounded border" />}
                </div>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="Or paste image URL" className={`${inputClass} mt-2 text-sm`} />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea rows={10} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder={'Write the event write-up here.\n\nLeave a blank line between paragraphs. Use **bold** and *italic* for emphasis.'}
                  className={inputClass} />
                <p className="mt-1 text-xs text-gray-500">Blank line = new paragraph. <code>**bold**</code> and <code>*italic*</code> are supported.</p>
              </div>

              {/* Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Links (PDF)</label>
                <div className="space-y-3">
                  {form.documents.map((doc, i) => (
                    <div key={`${doc.url}-${i}`} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 flex-shrink-0">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        </svg>
                        <input value={doc.label}
                          onChange={e => setForm(f => ({ ...f, documents: f.documents.map((d, di) => di === i ? { ...d, label: e.target.value } : d) }))}
                          className="border border-blue-200 bg-white px-2 py-1 text-sm w-72 outline-none focus:ring-2 focus:ring-[#725D92]" />
                        <span className="text-xs text-gray-500 truncate max-w-[180px]">{doc.fileName}</span>
                      </div>
                      <button type="button" onClick={() => setForm(f => ({ ...f, documents: f.documents.filter((_, di) => di !== i) }))}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold flex-shrink-0">Remove</button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input value={docLabel} onChange={e => setDocLabel(e.target.value)} placeholder="Link text, e.g. Read the full event report here"
                      className="flex-1 rounded-none border-2 border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#725D92] outline-none" />
                    <input ref={docInputRef} type="file" accept="application/pdf" onChange={handleDocUpload} className="hidden" />
                    <button type="button" onClick={() => docInputRef.current?.click()} disabled={uploadingDoc}
                      className="rounded-none font-semibold text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 whitespace-nowrap">
                      {uploadingDoc ? 'Uploading...' : 'Upload PDF'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo gallery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo Gallery</label>
                {form.gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {form.gallery.map((photo, i) => (
                      <div key={`${photo.url}-${i}`} className="border border-gray-200 rounded overflow-hidden">
                        <img src={photo.url} alt="" className="h-24 w-full object-cover" />
                        <input value={photo.alt} placeholder="Alt text"
                          onChange={e => setForm(f => ({ ...f, gallery: f.gallery.map((p, pi) => pi === i ? { ...p, alt: e.target.value } : p) }))}
                          className="w-full border-t border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-[#725D92]" />
                        <div className="flex justify-between border-t border-gray-200 bg-gray-50 px-2 py-1">
                          <div className="flex gap-1">
                            <button type="button" onClick={() => movePhoto(i, -1)} disabled={i === 0} className="text-xs text-gray-600 hover:text-gray-900 disabled:opacity-30">&larr;</button>
                            <button type="button" onClick={() => movePhoto(i, 1)} disabled={i === form.gallery.length - 1} className="text-xs text-gray-600 hover:text-gray-900 disabled:opacity-30">&rarr;</button>
                          </div>
                          <button type="button" onClick={() => setForm(f => ({ ...f, gallery: f.gallery.filter((_, pi) => pi !== i) }))}
                            className="text-xs font-semibold text-red-500 hover:text-red-700">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                <button type="button" onClick={() => photoInputRef.current?.click()} disabled={uploadingPhoto}
                  className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50">
                  {uploadingPhoto ? 'Uploading...' : 'Upload Photos'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDialog(false)} className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
              <button onClick={handleSubmit} disabled={saving} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white disabled:opacity-50">
                {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
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
            <p className="text-gray-600 mb-4">Are you sure you want to delete this event? This action cannot be undone.</p>
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
