import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'womenrf';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) return null;
  if (cachedClient) return cachedClient;
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await client.connect();
    // Quick ping to verify connectivity
    await client.db(dbName).command({ ping: 1 });
    console.log('[MongoDB] Connected successfully');
    cachedClient = client;
    return client;
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err instanceof Error ? err.message : err);
    cachedClient = null;
    cachedDb = null;
    return null;
  }
}

export async function getDb(): Promise<Db | null> {
  if (!uri) return null;
  if (cachedDb) return cachedDb;
  const client = await getMongoClient();
  if (!client) return null;
  cachedDb = client.db(dbName);
  return cachedDb;
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.startsWith('mongodb'));
}
