import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'womenrf';

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is required.');
  console.error('Usage: MONGODB_URI="mongodb+srv://..." node scripts/seed-team-to-mongo.mjs');
  process.exit(1);
}

const sections = ['team', 'header', 'footer', 'events'];

console.log(`Connecting to MongoDB (${dbName})...`);
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  console.log('Connected successfully.\n');

  const db = client.db(dbName);
  const contentColl = db.collection('content');
  const versionsColl = db.collection('content_versions');
  const auditColl = db.collection('audit');
  const now = new Date();

  for (const section of sections) {
    const filePath = join(__dirname, '..', 'data', `${section}.json`);
    let data;
    try {
      data = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch {
      console.log(`Skipping ${section}: no local data file found.`);
      continue;
    }

    const existing = await contentColl.findOne({ _id: section });
    if (existing) {
      await versionsColl.insertOne({ section, data: existing.data, savedAt: now });
      console.log(`[${section}] Backed up existing data.`);
    }

    await contentColl.updateOne(
      { _id: section },
      { $set: { data, updatedAt: now } },
      { upsert: true },
    );

    await auditColl.insertOne({ savedAt: now, section, action: 'seed', detail: 'seed script' });

    if (section === 'team') {
      console.log(`[${section}] Seeded ${data.members.length} members.`);
      data.members.forEach((m) => console.log(`  - ${m.name} (${m.role})`));
    } else if (section === 'events') {
      console.log(`[${section}] Seeded ${data.events.length} events.`);
      data.events.forEach((e) => console.log(`  - ${e.title}`));
    } else {
      console.log(`[${section}] Seeded successfully.`);
    }
  }

  console.log('\nDone.');
} catch (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
} finally {
  await client.close();
}
