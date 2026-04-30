import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission, isSuperAdminRequest, getSessionFromHeaders } from '@/lib/permissionCheck';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await requirePermission(request, 'applications.edit');
  if (!check.ok) return check.response;

  const { id } = await params;
  const body = await request.json();
  const updates: Record<string, string> = {};

  if (body.status !== undefined) updates.status = body.status;

  // Recruiter reassignment requires elevated permission: super_admin or admin role
  if (body.recruiter_id !== undefined) {
    const session = getSessionFromHeaders(request);
    const role = session?.role ?? '';
    const canReassign = isSuperAdminRequest(request) || role === 'admin';
    if (!canReassign)
      return NextResponse.json({ error: 'Forbidden: recruiter reassignment requires admin role' }, { status: 403 });
    updates.recruiter_id   = body.recruiter_id;
    updates.recruiter_name = body.recruiter_name ?? '';
  }

  const { error } = await createAdminClient()
    .from('applications').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await requirePermission(request, 'applications.delete');
  if (!check.ok) return check.response;

  const { id } = await params;
  const { error } = await createAdminClient()
    .from('applications').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
