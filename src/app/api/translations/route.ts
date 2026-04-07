import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TRANSLATIONS_COLLECTION = 'translations';
const VALID_LOCALES = ['en', 'fa', 'ps'];

/**
 * GET /api/translations?locale=en
 * Returns { [key]: value } map for the requested locale.
 * Falls back to an empty object if nothing is stored yet.
 */
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale');

  if (!locale || !VALID_LOCALES.includes(locale)) {
    return NextResponse.json(
      { error: 'Invalid or missing locale. Use ?locale=en|fa|ps' },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({}, { status: 503 });
    }

    const doc = await db
      .collection(TRANSLATIONS_COLLECTION)
      .findOne({ _id: locale as any });

    return NextResponse.json(doc?.strings ?? {});
  } catch (error) {
    console.error('[API] Error reading translations:', error);
    return NextResponse.json({}, { status: 500 });
  }
}
