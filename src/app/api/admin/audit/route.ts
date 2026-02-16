import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogTail } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NothingIsPermanent';

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const lines = await getAuditLogTail(200);
  return NextResponse.json({ log: lines });
}
