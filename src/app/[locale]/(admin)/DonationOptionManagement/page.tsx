'use client';

import { useState, useEffect, useRef } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { loadAdminData, saveAdminData } from '@/lib/adminApi';

const SvgSquarePen = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
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

const COLOR_OPTIONS = [
  { value: 'bg-primary', label: 'Primary' },
  { value: 'bg-secondary', label: 'Secondary' },
  { value: 'bg-accent', label: 'Accent' },
  { value: 'bg-support-1', label: 'Support' },
];

type DonationOption = {
  id: string;
  order: number;
  title: string;
  content: string;
  iconName: string;
  colorClass: string;
  displayOrder: number;
  isActive: boolean;
};

const defaultOptions: DonationOption[] = [
  { id: '1', order: 5, title: 'Contact us', content: '', iconName: 'Mail', colorClass: 'bg-primary', displayOrder: 5, isActive: true },
  { id: '2', order: 10, title: 'Write a personal check', content: '', iconName: 'Mail', colorClass: 'bg-primary', displayOrder: 10, isActive: true },
  { id: '3', order: 20, title: 'Leave a legacy gift', content: '', iconName: 'Gift', colorClass: 'bg-secondary', displayOrder: 20, isActive: true },
  { id: '4', order: 30, title: 'Donate your stocks', content: '', iconName: 'TrendingUp', colorClass: 'bg-accent', displayOrder: 30, isActive: true },
  { id: '5', order: 40, title: 'Donate by phone', content: '', iconName: 'Phone', colorClass: 'bg-support-1', displayOrder: 40, isActive: true },
];

export default function DonationOptionManagementPage() {
  const [options, setOptions] = useState<DonationOption[]>(defaultOptions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [iconName, setIconName] = useState('');
  const [colorClass, setColorClass] = useState('bg-primary');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAdminData<{ options: DonationOption[] }>('donation-options').then(data => {
      if (!data || !Array.isArray(data.options)) return;
      const normalized = data.options.map((o: any) => ({
        id: String(o.id ?? o.order ?? Math.random()),
        order: Number(o.order) || 0,
        title: o.title ?? '',
        content: o.content ?? '',
        iconName: o.iconName ?? 'Mail',
        colorClass: o.colorClass ?? 'bg-primary',
        displayOrder: Number(o.displayOrder ?? o.order ?? 0),
        isActive: o.isActive !== false,
      }));
      setOptions(normalized);
    });
  }, []);

  const persistOptions = async (updatedOptions: typeof options) => {
    setSaveStatus('saving');
    const ok = await saveAdminData('donation-options', { options: updatedOptions });
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setIconName('');
    setColorClass('bg-primary');
    setDisplayOrder(0);
    setIsActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedOptions: DonationOption[];
    const editingIdStr = editingId ? String(editingId) : null;
    if (editingIdStr) {
      updatedOptions = options.map((opt) =>
        String(opt.id) === editingIdStr
          ? { ...opt, title, content, iconName, colorClass, displayOrder, isActive }
          : opt
      );
    } else {
      const nextOrder = options.length ? Math.max(...options.map((o) => o.displayOrder)) + 10 : 10;
      updatedOptions = [
        ...options,
        {
          id: String(Date.now()),
          order: nextOrder,
          title,
          content,
          iconName: iconName || 'Mail',
          colorClass,
          displayOrder: displayOrder ?? nextOrder,
          isActive,
        },
      ];
    }
    setOptions(updatedOptions);
    resetForm();
    await persistOptions(updatedOptions);
  };

  const handleEdit = (opt: DonationOption) => {
    setEditingId(String(opt.id));
    setTitle(opt.title ?? '');
    setContent(opt.content ?? '');
    setIconName(opt.iconName ?? 'Mail');
    setColorClass(opt.colorClass ?? 'bg-primary');
    setDisplayOrder(opt.displayOrder ?? 0);
    setIsActive(opt.isActive !== false);
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (id: string) => {
    const idStr = String(id);
    const updatedOptions = options.filter((o) => String(o.id) !== idStr);
    setOptions(updatedOptions);
    if (editingId !== null && String(editingId) === idStr) resetForm();
    await persistOptions(updatedOptions);
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
  const textareaClass =
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const cardClass = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const btnPrimary =
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2';
  const btnIcon = 'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10';

  const sortedOptions = [...options].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Create New Donation Option */}
        <div ref={formCardRef} className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {editingId ? 'Edit Donation Option' : 'Create New Donation Option'}
            </h3>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                className={inputClass}
                placeholder="Title (e.g., Write a personal check)"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className={textareaClass}
                placeholder="Content/Instructions (HTML supported)"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Lucide Icon Name (e.g., Mail)"
                  required
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                />
                <select
                  className={inputClass}
                  value={colorClass}
                  onChange={(e) => setColorClass(e.target.value)}
                >
                  {COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Display Order"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isActive}
                  onClick={() => setIsActive(!isActive)}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex items-center justify-center"
                  style={{ backgroundColor: isActive ? 'var(--primary, #1c75bc)' : undefined, color: isActive ? 'white' : undefined }}
                >
                  {isActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
                <label className="text-sm font-medium leading-none cursor-pointer" onClick={() => setIsActive(!isActive)}>
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-2">
                {editingId && (
                  <button type="button" onClick={resetForm} className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2">
                    Cancel
                  </button>
                )}
                <button type="submit" className={btnPrimary}>
                  {editingId ? 'Update Option' : 'Create Option'}
                </button>
                {saveStatus === 'saving' && <span className="text-sm text-gray-500 ml-3">Saving...</span>}
                {saveStatus === 'saved' && <span className="text-sm text-green-600 ml-3">Saved successfully!</span>}
                {saveStatus === 'error' && <span className="text-sm text-red-600 ml-3">Error saving. Try again.</span>}
              </div>
            </form>
          </div>
        </div>

        {/* Existing Donation Options */}
        <div className={cardClass}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Existing Donation Options</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Order
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Title
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Color
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Active
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {sortedOptions.map((opt) => (
                    <tr key={opt.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{opt.displayOrder}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{opt.title}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <div className={`w-4 h-4 rounded-full ${opt.colorClass}`} />
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{opt.isActive ? 'Yes' : 'No'}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(opt)}
                          className={btnIcon}
                          aria-label="Edit"
                        >
                          <SvgSquarePen className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(opt.id)}
                          className={btnIcon}
                          aria-label="Delete"
                        >
                          <SvgTrash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
