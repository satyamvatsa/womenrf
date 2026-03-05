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

const teamPath = join(__dirname, '..', 'data', 'team.json');
const teamData = JSON.parse(readFileSync(teamPath, 'utf-8'));

console.log(`Connecting to MongoDB (${dbName})...`);
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  console.log('Connected successfully.');

  const db = client.db(dbName);
  const contentColl = db.collection('content');
  const now = new Date();

  const existing = await contentColl.findOne({ _id: 'team' });
  if (existing) {
    const versionsColl = db.collection('content_versions');
    await versionsColl.insertOne({
      section: 'team',
      data: existing.data,
      savedAt: now,
    });
    console.log('Backed up existing team data to content_versions.');
  }

  await contentColl.updateOne(
    { _id: 'team' },
    { $set: { data: teamData, updatedAt: now } },
    { upsert: true },
  );

  console.log(`Seeded team data: ${teamData.members.length} members, ${teamData.categories.length} categories.`);
  teamData.members.forEach((m) => console.log(`  - ${m.name} (${m.role})`));

  await db.collection('audit').insertOne({
    savedAt: now,
    section: 'team',
    action: 'seed',
    detail: 'seed-team-to-mongo script',
  });

  console.log('Done.');
} catch (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
} finally {
  await client.close();
}
