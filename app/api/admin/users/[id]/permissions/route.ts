import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSuperAdminRequest, getSessionFromHeaders } from '@/lib/permissionCheck';
import { ALL_PERMISSIONS } from '@/lib/permissions';
import type { Permission } from '@/lib/permissions';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Only super admin may modify permissions
  if (!isSuperAdminRequest(request))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const session = getSessionFromHeaders(request);
  const { id } = await params;

  // Fetch the target user to prevent escalation attacks
  const { data: target, error: fetchErr } = await createAdminClient()
    .from('admin_users')
    .select('id, email, role')
    .eq('id', id)
    .single();

  if (fetchErr || !target)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Never allow modifying another super_admin's permissions through this endpoint
  if (target.role === 'super_admin')
    return NextResponse.json({ error: 'Cannot modify super admin permissions' }, { status: 403 });

  // Prevent self-modification (super admin manages others, not themselves)
  if (session && target.email === session.email)
    return NextResponse.json({ error: 'Cannot modify your own permissions' }, { status: 403 });

  const body = await request.json();
  const incoming: unknown = body.permissions;

  if (!Array.isArray(incoming))
    return NextResponse.json({ error: 'permissions must be an array' }, { status: 400 });

  // Validate — only known permissions are accepted; unknown values are silently dropped
  const cleaned: Permission[] = (incoming as string[]).filter(
    (p): p is Permission => ALL_PERMISSIONS.includes(p as Permission)
  );

  const { data, error } = await createAdminClient()
    .from('admin_users')
    .update({
      permissions: cleaned,
      permissions_updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, email, name, role, active, permissions, permissions_updated_at')
    .single();

  if (error || !data)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    active: data.active,
    permissions: data.permissions ?? [],
    permissionsUpdatedAt: data.permissions_updated_at,
  });
}
