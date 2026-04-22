import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/middleware';
import { adminUserFromRow } from '@/lib/adminUsers';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/admin_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await verifyAdminToken(token, process.env.ADMIN_SECRET ?? '');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (session.email === process.env.ADMIN_EMAIL)
    return NextResponse.json({ email: session.email, role: 'super_admin', name: 'Super Admin' });

  const { data } = await createAdminClient()
    .from('admin_users').select('*').eq('email', session.email).single();
  const admin = data ? adminUserFromRow(data) : null;
  return NextResponse.json({
    email: session.email,
    role: session.role,
    name: admin?.name ?? session.email,
  });
}
