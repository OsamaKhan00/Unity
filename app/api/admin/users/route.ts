import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminUser, AdminRole, adminUserFromRow, adminUserToRow, hashPassword } from '@/lib/adminUsers';
import { verifyAdminToken } from '@/middleware';

async function getSuperAdminOnly(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/admin_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return false;
  const session = await verifyAdminToken(token, process.env.ADMIN_SECRET ?? '');
  return session?.role === 'super_admin';
}

export async function GET(request: Request) {
  if (!(await getSuperAdminOnly(request)))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { data, error } = await createAdminClient().from('admin_users').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    (data ?? []).map(adminUserFromRow).map(({ passwordHash: _, ...u }) => u)
  );
}

export async function POST(request: Request) {
  if (!(await getSuperAdminOnly(request)))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { data: existing } = await createAdminClient()
    .from('admin_users').select('id').eq('email', body.email).single();
  if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  const newUser: AdminUser = {
    id: Date.now().toString(),
    email: String(body.email),
    name: String(body.name ?? ''),
    role: (body.role ?? 'editor') as AdminRole,
    passwordHash: hashPassword(String(body.password ?? 'changeme123')),
    active: true,
    createdAt: new Date().toISOString(),
  };
  const { data, error } = await createAdminClient()
    .from('admin_users').insert(adminUserToRow(newUser)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { passwordHash: _, ...safeUser } = adminUserFromRow(data);
  return NextResponse.json(safeUser, { status: 201 });
}
