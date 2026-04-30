import { NextResponse } from 'next/server';
import { getSessionFromHeaders } from '@/lib/permissionCheck';
import { createAdminClient } from '@/lib/supabase/admin';
import { ALL_PERMISSIONS } from '@/lib/permissions';

export async function GET(request: Request) {
  const session = getSessionFromHeaders(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Super admin has all permissions implicitly
  if (session.role === 'super_admin') {
    return NextResponse.json({
      email: session.email,
      role: 'super_admin',
      name: 'Super Admin',
      permissions: ALL_PERMISSIONS,
    });
  }

  const { data } = await createAdminClient()
    .from('admin_users')
    .select('name, role, active, permissions')
    .eq('email', session.email)
    .single();

  if (!data || !data.active)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({
    email: session.email,
    role: session.role,
    name: data.name ?? session.email,
    permissions: Array.isArray(data.permissions) ? data.permissions : [],
  });
}
