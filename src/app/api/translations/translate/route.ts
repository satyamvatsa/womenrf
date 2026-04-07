import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { translateAll } from '@/lib/translate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NothingIsPermanent';
const TRANSLATIONS_COLLECTION = 'translations';

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

/**
 * POST /api/translations/translate
 * Body: { locales?: ["fa", "ps"] }
 *
 * Reads English strings from MongoDB, translates them via OpenAI,
 * and saves the results back into the translations collection.
 * Requires admin auth (Bearer token).
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured' },
      { status: 500 },
    );
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Database not available' },
      { status: 503 },
    );
  }

  let targetLocales: string[] = ['fa', 'ps'];
  try {
    const body = await request.json();
    if (Array.isArray(body?.locales) && body.locales.length > 0) {
      targetLocales = body.locales.filter((l: string) =>
        ['fa', 'ps'].includes(l),
      );
    }
  } catch {
    // use defaults
  }

  const enDoc = await db
    .collection(TRANSLATIONS_COLLECTION)
    .findOne({ _id: 'en' as any });

  if (!enDoc?.strings || Object.keys(enDoc.strings).length === 0) {
    return NextResponse.json(
      { error: 'No English strings found in database. Run the seed script first.' },
      { status: 404 },
    );
  }

  const englishStrings: Record<string, string> = enDoc.strings;
  const results: Record<string, { keys: number; status: string }> = {};

  for (const locale of targetLocales) {
    try {
      console.log(`[Translate] Starting ${locale}...`);

      const translated = await translateAll(
        englishStrings,
        locale,
        (done, total) => {
          console.log(`[Translate] ${locale}: ${done}/${total} keys`);
        },
      );

      await db.collection(TRANSLATIONS_COLLECTION).updateOne(
        { _id: locale as any },
        {
          $set: {
            strings: translated,
            updatedAt: new Date(),
            translatedBy: 'openai',
            sourceLocale: 'en',
          },
        },
        { upsert: true },
      );

      results[locale] = {
        keys: Object.keys(translated).length,
        status: 'success',
      };
      console.log(`[Translate] ${locale} complete: ${Object.keys(translated).length} keys`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[Translate] ${locale} failed:`, msg);
      results[locale] = { keys: 0, status: `error: ${msg}` };
    }
  }

  return NextResponse.json({
    success: true,
    results,
    sourceKeys: Object.keys(englishStrings).length,
  });
}
