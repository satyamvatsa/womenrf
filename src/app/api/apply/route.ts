import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { readData, writeData } from '@/lib/db';
import { isS3Configured, uploadToS3 } from '@/lib/s3';
import { sendJobApplicationNotification, sendJobApplicationConfirmation } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const CONTENT_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function safeName(original: string): string {
  const ext = path.extname(original).toLowerCase() || '.pdf';
  const base = path.basename(original, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40);
  return `${base}-${Date.now()}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = (formData.get('fullName') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const position = (formData.get('position') as string)?.trim();
    const vacancyId = (formData.get('vacancyId') as string)?.trim();
    const coverLetter = (formData.get('coverLetter') as string)?.trim();
    const resumeUrl = (formData.get('resumeUrl') as string)?.trim();
    const resumeFile = formData.get('resume') as File | null;

    if (!fullName || !email || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let finalResumeUrl = resumeUrl || undefined;
    let resumeBuffer: Buffer | null = null;
    let resumeFilename = '';
    let resumeContentType = 'application/octet-stream';

    if (resumeFile && resumeFile instanceof File && resumeFile.size > 0) {
      if (resumeFile.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
      }

      const ext = path.extname(resumeFile.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json({ error: 'Invalid file type. Please upload PDF, DOC, or DOCX.' }, { status: 400 });
      }

      const filename = safeName(resumeFile.name);
      const bytes = await resumeFile.arrayBuffer();
      resumeBuffer = Buffer.from(bytes);
      resumeFilename = resumeFile.name;
      resumeContentType = CONTENT_TYPES[ext] || 'application/octet-stream';

      if (isS3Configured()) {
        const s3Key = `resumes/${filename}`;
        finalResumeUrl = await uploadToS3(s3Key, resumeBuffer, resumeFile.name);
      } else {
        const dir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(path.join(dir, filename), resumeBuffer);
        finalResumeUrl = `/uploads/resumes/${filename}`;
      }
    }

    // Save to database
    const existing = (await readData<unknown[]>('job-applications')) || [];
    const list = Array.isArray(existing) ? existing : [];
    list.push({
      fullName,
      email,
      phone,
      position,
      vacancyId,
      coverLetter,
      resumeUrl: finalResumeUrl,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'new',
    });
    await writeData('job-applications', list);

    // Send emails with resume attached
    if (email && position) {
      const emailParams = {
        fullName,
        email,
        phone,
        position,
        coverLetter: coverLetter || '',
        resumeUrl: finalResumeUrl,
        resumeAttachment: resumeBuffer
          ? { filename: resumeFilename, content: resumeBuffer, contentType: resumeContentType }
          : undefined,
      };

      Promise.allSettled([
        sendJobApplicationNotification(emailParams),
        sendJobApplicationConfirmation(emailParams),
      ]).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Application submit error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
