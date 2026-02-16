import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';

type ContentDoc = { _id: string; data: unknown; updatedAt?: Date };
type VersionDoc = { _id?: ObjectId; section: string; data: unknown; savedAt: Date };

const CONTENT_COLLECTION = 'content';
const VERSIONS_COLLECTION = 'content_versions';
const AUDIT_COLLECTION = 'audit';
const VERSION_RETENTION_DAYS = 60;

let ttlIndexEnsured = false;

async function ensureTTLIndex() {
  if (ttlIndexEnsured) return;
  const db = await getDb();
  if (!db) return;
  const desiredSeconds = VERSION_RETENTION_DAYS * 24 * 60 * 60;
  try {
    const coll = db.collection(VERSIONS_COLLECTION);
    // Try to create the index; if it already exists with a different expiry, update it
    try {
      await coll.createIndex(
        { savedAt: 1 },
        { expireAfterSeconds: desiredSeconds }
      );
    } catch (e: unknown) {
      // Index exists with different options → update via collMod
      if (e && typeof e === 'object' && 'codeName' in e && (e as { codeName: string }).codeName === 'IndexOptionsConflict') {
        await db.command({
          collMod: VERSIONS_COLLECTION,
          index: { keyPattern: { savedAt: 1 }, expireAfterSeconds: desiredSeconds },
        });
      }
    }
    ttlIndexEnsured = true;
  } catch {
    // ignore – non-critical
  }
}

export async function readDataMongo<T = Record<string, unknown>>(section: string): Promise<T | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const doc = await db.collection<ContentDoc>(CONTENT_COLLECTION).findOne({ _id: section });
    if (!doc || doc.data === undefined) return null;
    return doc.data as T;
  } catch {
    return null;
  }
}

export async function writeDataMongo(section: string, data: unknown): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await ensureTTLIndex();
  const contentColl = db.collection<ContentDoc>(CONTENT_COLLECTION);
  const versionsColl = db.collection<VersionDoc>(VERSIONS_COLLECTION);
  const auditColl = db.collection(AUDIT_COLLECTION);

  const now = new Date();

  // Save current state to versions before overwriting (keep 60 days via TTL)
  const current = await contentColl.findOne({ _id: section });
  if (current && current.data !== undefined) {
    await versionsColl.insertOne({
      section,
      data: current.data,
      savedAt: now,
    });
  }

  await contentColl.updateOne(
    { _id: section },
    { $set: { data, updatedAt: now } },
    { upsert: true }
  );

  await auditColl.insertOne({
    savedAt: now,
    section,
    action: 'save',
  });
}

/** List versions for a section (newest first). Returns array of { id, savedAt }. */
export async function listBackupsMongo(section: string): Promise<{ id: string; savedAt: string }[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    const cursor = db
      .collection<VersionDoc>(VERSIONS_COLLECTION)
      .find({ section })
      .sort({ savedAt: -1 })
      .limit(200)
      .project({ _id: 1, savedAt: 1 });
    const list = await cursor.toArray();
    return list.map((d) => ({
      id: (d._id as ObjectId).toString(),
      savedAt: (d.savedAt as Date).toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function getVersionMongo(section: string, versionId: string): Promise<unknown | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const doc = await db.collection<VersionDoc>(VERSIONS_COLLECTION).findOne({
      _id: new ObjectId(versionId),
      section,
    });
    return doc?.data ?? null;
  } catch {
    return null;
  }
}

/** Restore section from a version (overwrites current, does not create a new version). */
export async function restoreFromBackupMongo(section: string, versionId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const data = await getVersionMongo(section, versionId);
  if (data === null) return false;
  try {
    const now = new Date();
    await db.collection<ContentDoc>(CONTENT_COLLECTION).updateOne(
      { _id: section },
      { $set: { data, updatedAt: now } },
      { upsert: true }
    );
    await db.collection(AUDIT_COLLECTION).insertOne({
      savedAt: now,
      section,
      action: 'restore',
      detail: versionId,
    });
    return true;
  } catch {
    return false;
  }
}

export async function getAuditLogTailMongo(maxLines: number = 500): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    const cursor = db
      .collection(AUDIT_COLLECTION)
      .find({})
      .sort({ savedAt: -1 })
      .limit(maxLines)
      .project({ savedAt: 1, section: 1, action: 1, detail: 1 });
    const docs = await cursor.toArray();
    return docs.map((d) => {
      const detail = d.detail ? `\t${d.detail}` : '';
      return `${(d.savedAt as Date).toISOString()}\t${d.section}\t${d.action}${detail}`;
    });
  } catch {
    return [];
  }
}
