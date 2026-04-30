import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission } from '@/lib/permissionCheck';
import { personFromRow, personToRow } from '@/lib/contentData';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await requirePermission(request, 'people.view');
  if (!check.ok) return check.response;

  const { id } = await params;
  const { data, error } = await createAdminClient()
    .from('people').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(personFromRow(data));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await requirePermission(request, 'people.manage');
  if (!check.ok) return check.response;

  const { id } = await params;
  const body = await request.json();
  const { data, error } = await createAdminClient()
    .from('people').update(personToRow({ ...body, id })).eq('id', id).select().single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(personFromRow(data));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await requirePermission(request, 'people.manage');
  if (!check.ok) return check.response;

  const { id } = await params;
  const { error } = await createAdminClient().from('people').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
