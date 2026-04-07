import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { translateCmsSection } from '@/lib/translate-cms';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NothingIsPermanent';

const VALID_SECTIONS = [
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
  'news',
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
  'events',
];

const TRANSLATABLE_SECTIONS = new Set([
  'about',
  'homepage',
  'header',
  'footer',
  'privacy-policy',
  'donations',
  'donation-options',
  'blog-posts',
  'news',
  'programs',
  'testimonials',
  'founders',
  'team',
  'vacancies',
  'volunteers',
  'partnerships',
  'faq',
  'faqs',
  'events',
]);

const VALID_LOCALES = ['en', 'fa', 'ps'];

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

/** GET: Read section data (public – no auth required). Supports ?locale= for translated versions. */
export async function GET(
  request: NextRequest,
  context: { params: { section: string } }
) {
  const section = context.params.section;
  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }

  const locale = request.nextUrl.searchParams.get('locale') || 'en';

  try {
    if (locale !== 'en' && VALID_LOCALES.includes(locale) && TRANSLATABLE_SECTIONS.has(section)) {
      const translated = await readData(`${section}__${locale}`);
      if (translated && typeof translated === 'object' && Object.keys(translated as object).length > 0) {
        return NextResponse.json(translated);
      }
    }
    const data = await readData(section);
    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error(`[API] Error reading section "${section}":`, error);
    return NextResponse.json({}, { status: 500 });
  }
}

/** PUT: Update section data (admin auth required). Auto-translates to fa/ps in the background. */
export async function PUT(
  request: NextRequest,
  context: { params: { section: string } }
) {
  const section = context.params.section;
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }
  try {
    const body = await request.json();
    await writeData(section, body);

    if (TRANSLATABLE_SECTIONS.has(section) && process.env.OPENAI_API_KEY) {
      translateCmsSection(body)
        .then(async (translations) => {
          for (const [locale, translatedData] of Object.entries(translations)) {
            await writeData(`${section}__${locale}`, translatedData);
            console.log(`[Auto-translate] ${section}__${locale} saved`);
          }
        })
        .catch((err) => {
          console.error(`[Auto-translate] ${section} failed:`, err instanceof Error ? err.message : err);
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] Error saving section "${section}":`, error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
