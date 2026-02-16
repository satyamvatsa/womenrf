import { NextRequest, NextResponse } from 'next/server';
import { readDataFromFile } from '@/lib/db';
import { writeDataMongo } from '@/lib/db-mongo';
import { isMongoConfigured, getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // allow up to 2 minutes for migration

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NothingIsPermanent';

const SECTIONS = [
  'about',
  'homepage',
  'header',
  'footer',
  'privacy-policy',
  'page-settings',
  'site',
  'donations',
  'donation-options',
  'blog-posts',
  'programs',
  'testimonials',
  'founders',
  'team',
  'vacancies',
  'volunteers',
  'partnerships',
  'faq',
  'faqs',
  'newsletter',
  'users',
  'contact-submissions',
  'volunteer-applications',
  'partnership-inquiries',
  'newsletter-subscribers',
  'job-applications',
  'donation-intents',
];

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

/** POST: Copy all existing data from JSON files into MongoDB (one-time migration). */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: 'MongoDB is not configured. Set MONGODB_URI in .env.' },
      { status: 400 }
    );
  }

  // Verify actual connectivity before starting migration
  const db = await getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Cannot connect to MongoDB. Check your MONGODB_URI, password encoding, and Atlas Network Access (IP whitelist).' },
      { status: 503 }
    );
  }

  const migrated: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const section of SECTIONS) {
    const data = readDataFromFile(section);
    if (data === null || (typeof data === 'object' && Object.keys(data).length === 0)) {
      skipped.push(section);
      continue;
    }
    try {
      await writeDataMongo(section, data);
      migrated.push(section);
    } catch {
      failed.push(section);
    }
  }

  return NextResponse.json({
    success: true,
    migrated,
    skipped,
    failed,
    message: `Migrated ${migrated.length} section(s) to MongoDB.`,
  });
}
