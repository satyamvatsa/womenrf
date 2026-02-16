import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import path from 'path';
import { isMongoConfigured } from './mongodb';
import {
  readDataMongo,
  writeDataMongo,
  listBackupsMongo,
  getVersionMongo,
  restoreFromBackupMongo,
  getAuditLogTailMongo,
} from './db-mongo';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const MAX_BACKUPS_PER_SECTION = 60;

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function ensureBackupsDir(section: string) {
  const sectionDir = path.join(BACKUPS_DIR, section);
  if (!existsSync(sectionDir)) {
    mkdirSync(sectionDir, { recursive: true });
  }
  return sectionDir;
}

function appendAuditLog(section: string, action: string, detail?: string) {
  try {
    ensureDataDir();
    const logPath = path.join(DATA_DIR, 'audit.log');
    const line = `${new Date().toISOString()}\t${section}\t${action}${detail ? `\t${detail}` : ''}\n`;
    writeFileSync(logPath, line, { flag: 'a', encoding: 'utf-8' });
  } catch {
    // ignore
  }
}

function pruneOldBackups(sectionDir: string) {
  try {
    const files = readdirSync(sectionDir).sort();
    if (files.length <= MAX_BACKUPS_PER_SECTION) return;
    const toRemove = files.slice(0, files.length - MAX_BACKUPS_PER_SECTION);
    toRemove.forEach((f) => unlinkSync(path.join(sectionDir, f)));
  } catch {
    // ignore
  }
}

// --------------- File-based (sync) ---------------

/** Read section from file only (for migration to MongoDB). */
export function readDataFromFile<T = Record<string, unknown>>(section: string): T | null {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${section}.json`);
  if (!existsSync(filePath)) return null;
  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readDataFile<T = Record<string, unknown>>(section: string): T | null {
  return readDataFromFile<T>(section);
}

function writeDataFile(section: string, data: unknown): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${section}.json`);

  if (existsSync(filePath)) {
    try {
      const sectionDir = ensureBackupsDir(section);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(sectionDir, `${timestamp}.json`);
      const current = readFileSync(filePath, 'utf-8');
      writeFileSync(backupPath, current, 'utf-8');
      pruneOldBackups(sectionDir);
    } catch {
      // continue
    }
  }

  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  appendAuditLog(section, 'save');
}

function listBackupsFile(section: string): { id: string; savedAt: string }[] {
  const sectionDir = path.join(BACKUPS_DIR, section);
  if (!existsSync(sectionDir)) return [];
  try {
    const files = readdirSync(sectionDir).sort().reverse();
    return files.map((f) => {
      const parsed = f.replace(/\.json$/, '').replace(/-/g, ' ');
      let savedAt = f;
      try {
        const d = new Date(parsed);
        if (!Number.isNaN(d.getTime())) savedAt = d.toISOString();
      } catch {
        // keep filename
      }
      return { id: f, savedAt };
    });
  } catch {
    return [];
  }
}

function readBackupFile(section: string, id: string): string | null {
  const filePath = path.join(BACKUPS_DIR, section, id);
  if (!existsSync(filePath)) return null;
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function restoreFromBackupFile(section: string, id: string): boolean {
  const content = readBackupFile(section, id);
  if (content === null) return false;
  try {
    JSON.parse(content);
    ensureDataDir();
    const filePath = path.join(DATA_DIR, `${section}.json`);
    writeFileSync(filePath, content, 'utf-8');
    appendAuditLog(section, 'restore', id);
    return true;
  } catch {
    return false;
  }
}

const AUDIT_LOG_PATH = path.join(process.cwd(), 'data', 'audit.log');
const MAX_AUDIT_LINES = 500;

function getAuditLogTailFile(maxLines: number = MAX_AUDIT_LINES): string[] {
  if (!existsSync(AUDIT_LOG_PATH)) return [];
  try {
    const raw = readFileSync(AUDIT_LOG_PATH, 'utf-8');
    const lines = raw.split('\n').filter(Boolean);
    return lines.slice(-maxLines).reverse();
  } catch {
    return [];
  }
}

// --------------- Public API (async, MongoDB when configured) ---------------

export async function readData<T = Record<string, unknown>>(section: string): Promise<T | null> {
  if (isMongoConfigured()) {
    return readDataMongo<T>(section);
  }
  return Promise.resolve(readDataFile<T>(section));
}

export async function writeData(section: string, data: unknown): Promise<void> {
  if (isMongoConfigured()) {
    return writeDataMongo(section, data);
  }
  writeDataFile(section, data);
}

/** List backups for a section (newest first). Each item has { id, savedAt }. */
export async function listBackups(section: string): Promise<{ id: string; savedAt: string }[]> {
  if (isMongoConfigured()) {
    return listBackupsMongo(section);
  }
  return Promise.resolve(listBackupsFile(section));
}

/** Restore section from a backup (id = filename for file, version id for MongoDB). */
export async function restoreFromBackup(section: string, id: string): Promise<boolean> {
  if (isMongoConfigured()) {
    return restoreFromBackupMongo(section, id);
  }
  return Promise.resolve(restoreFromBackupFile(section, id));
}

export async function getAuditLogTail(maxLines: number = MAX_AUDIT_LINES): Promise<string[]> {
  if (isMongoConfigured()) {
    return getAuditLogTailMongo(maxLines);
  }
  return Promise.resolve(getAuditLogTailFile(maxLines));
}
