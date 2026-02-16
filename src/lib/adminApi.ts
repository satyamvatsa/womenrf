const ADMIN_PASSWORD = 'NothingIsPermanent';

export async function loadAdminData<T>(section: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/data/${section}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && Object.keys(data).length > 0) return data as T;
    return null;
  } catch {
    return null;
  }
}

export async function saveAdminData<T>(section: string, data: T): Promise<boolean> {
  try {
    const res = await fetch(`/api/data/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_PASSWORD}`,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitPublicForm(section: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(`/api/submit/${section}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Upload an image; returns public URL or null. */
export async function uploadAdminImage(file: File): Promise<string | null> {
  try {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ADMIN_PASSWORD}` },
      body: form,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.url ?? null;
  } catch {
    return null;
  }
}

const adminHeaders = () => ({
  Authorization: `Bearer ${ADMIN_PASSWORD}`,
});

/** List sections that have backups, with count per section. */
export async function getBackupsSummary(): Promise<{ section: string; count: number }[]> {
  try {
    const res = await fetch('/api/admin/backups', { headers: adminHeaders(), cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sections ?? [];
  } catch {
    return [];
  }
}

/** List backups for a section (newest first). Each item is { id, savedAt }. */
export async function getBackupsForSection(section: string): Promise<{ id: string; savedAt: string }[]> {
  try {
    const res = await fetch(`/api/admin/backups?section=${encodeURIComponent(section)}`, { headers: adminHeaders(), cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.backups ?? [];
  } catch {
    return [];
  }
}

/** Restore a section from a backup (id = version id or filename). */
export async function restoreBackup(section: string, id: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/backups/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ section, id }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Get last 200 audit log lines. */
export async function getAuditLog(): Promise<string[]> {
  try {
    const res = await fetch('/api/admin/audit', { headers: adminHeaders(), cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.log ?? [];
  } catch {
    return [];
  }
}

/** One-time migration: copy data from JSON files into MongoDB. Returns { migrated, skipped, failed }. */
export async function migrateFileDataToMongo(): Promise<{
  success: boolean;
  migrated: string[];
  skipped: string[];
  failed: string[];
  message: string;
}> {
  try {
    const res = await fetch('/api/admin/migrate-to-mongo', {
      method: 'POST',
      headers: adminHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, migrated: [], skipped: [], failed: [], message: data.error || 'Migration failed' };
    return data;
  } catch {
    return { success: false, migrated: [], skipped: [], failed: [], message: 'Request failed' };
  }
}
