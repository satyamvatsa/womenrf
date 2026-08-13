'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'news' | 'announcement' | 'event' | 'statement';
  imageUrl: string;
  status: 'draft' | 'published';
  publishedAt: string;
}

const CATEGORIES = ['all', 'news', 'announcement', 'event', 'statement'] as const;

const CATEGORY_COLORS: Record<BlogPost['category'], string> = {
  news: 'bg-blue-100 text-blue-800',
  announcement: 'bg-yellow-100 text-yellow-800',
  event: 'bg-green-100 text-green-800',
  statement: 'bg-purple-100 text-purple-800',
};

const STATUS_COLORS: Record<BlogPost['status'], string> = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-emerald-100 text-emerald-800',
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '-').replace(/(^-|-$)/g, '');
}

const emptyPost: Omit<BlogPost, 'id'> = {
  title: '', slug: '', excerpt: '', content: '', category: 'news',
  imageUrl: '', status: 'draft', publishedAt: new Date().toISOString().split('T')[0],
};

export default function BlogPostManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyPost);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadAdminData<BlogPost[]>('blog-posts');
    if (data) setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (updated: BlogPost[]) => {
    setSaving(true);
    const ok = await saveAdminData('blog-posts', updated);
    if (ok) setPosts(updated);
    else alert('Failed to save. Please try again.');
    setSaving(false);
  };

  const openAdd = () => {
    setEditingPost(null);
    setForm(emptyPost);
    setShowDialog(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, imageUrl: post.imageUrl, status: post.status, publishedAt: post.publishedAt });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    const slug = form.slug || slugify(form.title);
    if (editingPost) {
      const updated = posts.map(p => p.id === editingPost.id ? { ...p, ...form, slug } : p);
      await save(updated);
    } else {
      const newPost: BlogPost = { ...form, slug, id: crypto.randomUUID() };
      await save([...posts, newPost]);
    }
    setShowDialog(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await save(posts.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

  const filtered = filterCategory === 'all' ? posts : posts.filter(p => p.category === filterCategory);

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Blog Post Management</h1>
            <p className="text-gray-600 font-body">Manage news, announcements, events, and statements</p>
          </div>
          <button onClick={openAdd} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white">+ Add Post</button>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)}
              className={`rounded-none font-semibold text-sm px-4 py-2 capitalize ${filterCategory === cat ? 'bg-[#725D92] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {cat === 'all' ? `All (${posts.length})` : `${cat} (${posts.filter(p => p.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
            <p className="text-gray-500 text-lg font-semibold">No posts found</p>
            <p className="text-gray-400 mt-1">Create your first blog post to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{post.title}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${CATEGORY_COLORS[post.category]}`}>{post.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${STATUS_COLORS[post.status]}`}>{post.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{post.publishedAt}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(post)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#725D92] hover:bg-[#635081] text-white">Edit</button>
                      <button onClick={() => setDeleteId(post.id)} className="rounded-none font-semibold text-sm px-3 py-1 bg-[#E57173] hover:bg-[#d65a5c] text-white">Delete</button>
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
            <h2 className="text-xl font-bold mb-4">{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) })); }}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as BlogPost['category'] }))}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none">
                    <option value="news">News</option>
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                    <option value="statement">Statement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as BlogPost['status'] }))}
                    className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                <input type="date" value={form.publishedAt} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  className="w-full rounded-none border-2 border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#725D92] outline-none" />
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
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDialog(false)} className="rounded-none font-semibold text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
              <button onClick={handleSubmit} disabled={saving} className="rounded-none font-semibold text-sm px-4 py-2 bg-[#725D92] hover:bg-[#635081] text-white disabled:opacity-50">
                {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
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
            <p className="text-gray-600 mb-4">Are you sure you want to delete this post? This action cannot be undone.</p>
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
