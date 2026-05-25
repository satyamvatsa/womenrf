import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { sendJobApplicationNotification, sendJobApplicationConfirmation } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
  context: { params: { section: string } }
) {
  const section = context.params.section;
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

    if (section === 'job-applications' && body.email && body.position) {
      const emailParams = {
        fullName: body.fullName || 'Applicant',
        email: body.email,
        phone: body.phone,
        position: body.position,
        coverLetter: body.coverLetter || '',
        resumeUrl: body.resumeUrl,
      };

      // Fire both emails without blocking the response
      Promise.allSettled([
        sendJobApplicationNotification(emailParams),
        sendJobApplicationConfirmation(emailParams),
      ]).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
