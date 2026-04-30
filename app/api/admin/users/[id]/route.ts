import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminRole, adminUserFromRow, hashPassword } from '@/lib/adminUsers';
import { isSuperAdminRequest } from '@/lib/permissionCheck';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSuperAdminRequest(request))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  const update: Record<string, unknown> = {};
  if (body.name     !== undefined) update.name          = body.name;
  if (body.role     !== undefined) update.role          = body.role as AdminRole;
  if (body.active   !== undefined) update.active        = body.active;
  if (body.password !== undefined) update.password_hash = hashPassword(body.password);
  // Permissions are updated via the dedicated PATCH /permissions endpoint only

  const { data, error } = await createAdminClient()
    .from('admin_users').update(update).eq('id', id).select().single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { passwordHash: _, ...safeUser } = adminUserFromRow(data);
  return NextResponse.json(safeUser);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSuperAdminRequest(request))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { error } = await createAdminClient().from('admin_users').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
