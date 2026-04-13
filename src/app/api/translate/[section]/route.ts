import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { translateCmsSection } from '@/lib/translate-cms';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NothingIsPermanent';

const TRANSLATABLE_SECTIONS = new Set([
  'about', 'homepage', 'header', 'footer', 'privacy-policy',
  'donations', 'donation-options', 'blog-posts', 'news', 'programs',
  'testimonials', 'founders', 'team', 'vacancies', 'volunteers',
  'partnerships', 'faq', 'faqs', 'events',
]);

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

/**
 * POST: Trigger translation for a section.
 * Supports ?locale=fa to translate a single locale (recommended to stay within Lambda timeout).
 * Omit locale to translate all target locales.
 */
export async function POST(
  request: NextRequest,
  context: { params: { section: string } }
) {
  const section = context.params.section;
  const locale = request.nextUrl.searchParams.get('locale') || undefined;

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!TRANSLATABLE_SECTIONS.has(section)) {
    return NextResponse.json({ error: 'Section not translatable' }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Translation not configured' }, { status: 503 });
  }

  try {
    const data = await readData(section);
    if (!data) {
      return NextResponse.json({ error: 'No data found for section' }, { status: 404 });
    }

    // Load existing translations so we only re-translate new/changed strings
    const targetLocales = locale ? [locale] : ['fa', 'ps'];
    const existingTranslatedData: Record<string, unknown> = {};
    for (const loc of targetLocales) {
      const existing = await readData(`${section}__${loc}`);
      if (existing) existingTranslatedData[loc] = existing;
    }

    const translations = await translateCmsSection(data, locale, existingTranslatedData);
    const savedLocales: string[] = [];

    for (const [loc, translatedData] of Object.entries(translations)) {
      await writeData(`${section}__${loc}`, translatedData);
      savedLocales.push(loc);
      console.log(`[Translate API] ${section}__${loc} saved`);
    }

    return NextResponse.json({ success: true, locales: savedLocales });
  } catch (error) {
    console.error(`[Translate API] ${section} failed:`, error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
