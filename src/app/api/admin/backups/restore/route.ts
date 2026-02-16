import { NextRequest, NextResponse } from 'next/server';
import { restoreFromBackup, listBackups } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

/** POST { section, filename } → restore that backup. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const section = body.section ?? body.sectionId;
    const id = body.id ?? body.filename;
    if (!section || !id || !VALID_SECTIONS.includes(section)) {
      return NextResponse.json({ error: 'Invalid section or backup id' }, { status: 400 });
    }
    const backups = await listBackups(section);
    const validIds = backups.map((b) => b.id);
    if (!validIds.includes(id)) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }
    const ok = await restoreFromBackup(section, id);
    if (!ok) return NextResponse.json({ error: 'Restore failed' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
