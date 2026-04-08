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

/** POST: Trigger translation for a section. Reads current English data and translates to fa/ps. */
export async function POST(
  request: NextRequest,
  context: { params: { section: string } }
) {
  const section = context.params.section;

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

    const translations = await translateCmsSection(data);
    const locales: string[] = [];

    for (const [locale, translatedData] of Object.entries(translations)) {
      await writeData(`${section}__${locale}`, translatedData);
      locales.push(locale);
      console.log(`[Translate API] ${section}__${locale} saved`);
    }

    return NextResponse.json({ success: true, locales });
  } catch (error) {
    console.error(`[Translate API] ${section} failed:`, error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
