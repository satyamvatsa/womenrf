import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

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

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

/** GET: Read section data (public – no auth required). */
export async function GET(
  _request: NextRequest,
  context: { params: { section: string } }
) {
  const section = context.params.section;
  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }
  try {
    const data = await readData(section);
    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error(`[API] Error reading section "${section}":`, error);
    return NextResponse.json({}, { status: 500 });
  }
}

/** PUT: Update section data (admin auth required). */
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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] Error saving section "${section}":`, error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
