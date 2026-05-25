import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { isS3Configured, uploadToS3 } from '@/lib/s3';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

function safeName(original: string): string {
  const ext = path.extname(original).toLowerCase() || '.pdf';
  const base = path.basename(original, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40);
  return `${base}-${Date.now()}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload PDF, DOC, or DOCX.' }, { status: 400 });
    }

    const filename = safeName(file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isS3Configured()) {
      const s3Key = `resumes/${filename}`;
      const url = await uploadToS3(s3Key, buffer, file.name);
      return NextResponse.json({ url, storage: 's3' });
    }

    const dir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    writeFileSync(filePath, buffer);
    const url = `/uploads/resumes/${filename}`;
    return NextResponse.json({ url, storage: 'local' });
  } catch (e) {
    console.error('Resume upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
