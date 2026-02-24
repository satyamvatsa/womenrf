import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NothingIsPermanent';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_FOLDERS = ['partners', 'team', 'about', 'programs', 'news', 'blog'];

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

function safeName(original: string): string {
  const ext = path.extname(original).toLowerCase() || '.jpg';
  const base = path.basename(original, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40);
  return `${base}-${Date.now()}${ext}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, GIF, WebP, or SVG.' }, { status: 400 });
    }

    const folder = formData.get('folder');
    let subDir = '';
    if (typeof folder === 'string' && ALLOWED_FOLDERS.includes(folder)) {
      subDir = folder;
    }

    const dir = path.join(process.cwd(), 'public', 'images', subDir);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const filename = safeName(file.name);
    const filePath = path.join(dir, filename);
    const bytes = await file.arrayBuffer();
    writeFileSync(filePath, Buffer.from(bytes));
    const url = subDir ? `/images/${subDir}/${filename}` : `/images/${filename}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
