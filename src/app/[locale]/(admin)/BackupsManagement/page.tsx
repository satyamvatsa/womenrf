'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminShell, icons } from '@/components/AdminShell';
import { getBackupsSummary, getBackupsForSection, restoreBackup, getAuditLog, migrateFileDataToMongo } from '@/lib/adminApi';

export default function BackupsManagement() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const base = `/${locale}`;

  const [sections, setSections] = useState<{ section: string; count: number }[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [backups, setBackups] = useState<{ id: string; savedAt: string }[]>([]);
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrateResult, setMigrateResult] = useState<{ migrated: string[]; skipped: string[]; failed: string[] } | null>(null);

  useEffect(() => {
    Promise.all([getBackupsSummary(), getAuditLog()]).then(([sum, log]) => {
      setSections(sum);
      setAuditLog(log);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedSection) {
      setBackups([]);
      return;
    }
    setLoading(true);
    getBackupsForSection(selectedSection).then((list) => {
      setBackups(list);
      setLoading(false);
    });
  }, [selectedSection]);

  const handleRestore = async (backupId: string) => {
    if (!selectedSection) return;
    setRestoring(backupId);
    setMessage(null);
    const ok = await restoreBackup(selectedSection, backupId);
    setRestoring(null);
    if (ok) {
      setMessage({ type: 'ok', text: 'Restored successfully. Reload the content page to see changes.' });
      getBackupsForSection(selectedSection).then(setBackups);
    } else {
      setMessage({ type: 'err', text: 'Restore failed.' });
    }
  };

  const handleMigrate = async () => {
    setMigrating(true);
    setMessage(null);
    setMigrateResult(null);
    const result = await migrateFileDataToMongo();
    setMigrating(false);
    if (result.success) {
      setMigrateResult({ migrated: result.migrated, skipped: result.skipped, failed: result.failed });
      setMessage({ type: result.migrated.length > 0 ? 'ok' : 'ok', text: result.message });
      getBackupsSummary().then(setSections);
    } else {
      setMessage({ type: 'err', text: result.message });
    }
  };

  const formatSavedAt = (savedAt: string) => {
    try {
      const d = new Date(savedAt);
      if (!Number.isNaN(d.getTime())) return d.toLocaleString();
    } catch {
      // ignore
    }
    return savedAt;
  };

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-primary font-heading">Backups & History</h1>
          <p className="font-body text-gray-600">
            Every save creates a versioned backup. Backups are retained for 60 days. View audit log and restore a previous version if needed.
          </p>
        </div>

        {message && (
          <div className={`rounded-lg border p-4 ${message.type === 'ok' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="font-heading text-lg font-semibold text-blue-900 mb-2">Migrate file data to MongoDB</h3>
          <p className="text-sm text-blue-800 mb-3">
            If you had content in <code className="bg-blue-100 px-1 rounded">data/*.json</code> before setting MONGODB_URI, run this once to copy it into MongoDB.
          </p>
          <button
            type="button"
            disabled={migrating}
            onClick={handleMigrate}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {migrating ? 'Migrating…' : 'Run migration'}
          </button>
          {migrateResult && (
            <div className="mt-3 text-sm text-blue-800">
              {migrateResult.migrated.length > 0 && <p>Migrated: {migrateResult.migrated.join(', ')}</p>}
              {migrateResult.failed.length > 0 && <p className="text-red-600">Failed: {migrateResult.failed.join(', ')}</p>}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="border-b p-4">
              <h2 className="text-xl font-semibold font-heading flex items-center gap-2">
                {icons.archive}
                Section backups
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="">— Choose —</option>
                {sections.map((s) => (
                  <option key={s.section} value={s.section}>
                    {s.section} ({s.count} backups)
                  </option>
                ))}
              </select>

              {selectedSection && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Restore from backup (newest first):</p>
                  {loading ? (
                    <p className="text-sm text-gray-500">Loading…</p>
                  ) : backups.length === 0 ? (
                    <p className="text-sm text-gray-500">No backups for this section.</p>
                  ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {backups.map((b) => (
                        <li key={b.id} className="flex items-center justify-between gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                          <span className="truncate text-gray-700" title={b.id}>{formatSavedAt(b.savedAt)}</span>
                          <button
                            type="button"
                            disabled={restoring === b.id}
                            onClick={() => handleRestore(b.id)}
                            className="shrink-0 rounded bg-secondary px-3 py-1 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                          >
                            {restoring === b.id ? 'Restoring…' : 'Restore'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="border-b p-4">
              <h2 className="text-xl font-semibold font-heading">Audit log (recent)</h2>
              <p className="text-sm text-gray-500 mt-1">Each save and restore is recorded.</p>
            </div>
            <div className="p-4">
              {auditLog.length === 0 ? (
                <p className="text-sm text-gray-500">No entries yet.</p>
              ) : (
                <pre className="max-h-96 overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100 font-mono whitespace-pre-wrap break-all">
                  {auditLog.map((line, i) => (
                    <span key={i}>{line}\n</span>
                  ))}
                </pre>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <strong>Storage:</strong> When <code className="bg-blue-100 px-1 rounded">MONGODB_URI</code> is set, all content and form data are saved to MongoDB. Each save keeps the previous version for 60 days so you can restore from Backups &amp; History. Without MongoDB, data is stored in JSON files under <code className="bg-blue-100 px-1 rounded">data/</code> (not persistent on serverless).
        </div>
      </div>
    </AdminShell>
  );
}
