import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_SECTIONS = [
  'contact-submissions',
  'volunteer-applications',
  'partnership-inquiries',
  'newsletter-subscribers',
  'job-applications',
  'donation-intents',
];

export async function POST(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  const { section } = params;
  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }
  try {
    const body = await request.json();
    const existing = (await readData<unknown[]>(section)) || [];
    const list = Array.isArray(existing) ? existing : [];
    list.push({
      ...body,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'new',
    });
    await writeData(section, list);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
