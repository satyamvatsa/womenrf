import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'womenrf';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let connectingPromise: Promise<MongoClient | null> | null = null;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function attemptConnect(): Promise<MongoClient | null> {
  if (!uri) return null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        retryReads: true,
        retryWrites: true,
      });
      await client.connect();
      await client.db(dbName).command({ ping: 1 });
      console.log(`[MongoDB] Connected successfully (attempt ${attempt})`);
      return client;
    } catch (err) {
      console.error(`[MongoDB] Connection attempt ${attempt}/${MAX_RETRIES} failed:`, err instanceof Error ? err.message : err);
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt));
      }
    }
  }
  return null;
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) return null;
  if (cachedClient) return cachedClient;

  if (connectingPromise) return connectingPromise;

  connectingPromise = attemptConnect().then(client => {
    cachedClient = client;
    connectingPromise = null;
    return client;
  }).catch(() => {
    connectingPromise = null;
    return null;
  });

  return connectingPromise;
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
