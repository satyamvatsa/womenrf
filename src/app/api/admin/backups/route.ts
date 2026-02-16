import { NextRequest, NextResponse } from 'next/server';
import { listBackups } from '@/lib/db';

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
];

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

/** GET ?section=about → list backup filenames for that section. GET no param → list all sections with backup count. */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');

  if (section) {
    if (!VALID_SECTIONS.includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }
    const backups = await listBackups(section);
    return NextResponse.json({ section, backups });
  }

  const summary: { section: string; count: number }[] = [];
  for (const s of VALID_SECTIONS) {
    const backups = await listBackups(s);
    summary.push({ section: s, count: backups.length });
  }
  return NextResponse.json({ sections: summary });
}
