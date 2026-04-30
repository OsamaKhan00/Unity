import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminUser, AdminRole, adminUserFromRow, adminUserToRow, hashPassword } from '@/lib/adminUsers';
import { isSuperAdminRequest } from '@/lib/permissionCheck';
import { DEFAULT_PERMISSIONS } from '@/lib/permissions';

export async function GET(request: Request) {
  if (!isSuperAdminRequest(request))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await createAdminClient().from('admin_users').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map(adminUserFromRow).map(({ passwordHash: _, ...u }) => u)
  );
}

export async function POST(request: Request) {
  if (!isSuperAdminRequest(request))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const role = (body.role ?? 'editor') as AdminRole;

  const { data: existing } = await createAdminClient()
    .from('admin_users').select('id').eq('email', body.email).single();
  if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });

  const newUser: AdminUser = {
    id: Date.now().toString(),
    email: String(body.email),
    name: String(body.name ?? ''),
    role,
    passwordHash: hashPassword(String(body.password ?? 'changeme123')),
    active: true,
    createdAt: new Date().toISOString(),
    // Assign sensible defaults for the chosen role; super admin can customise after
    permissions: DEFAULT_PERMISSIONS[role] ?? [],
    permissionsUpdatedAt: new Date().toISOString(),
  };

  const { data, error } = await createAdminClient()
    .from('admin_users').insert(adminUserToRow(newUser)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { passwordHash: _, ...safeUser } = adminUserFromRow(data);
  return NextResponse.json(safeUser, { status: 201 });
}
