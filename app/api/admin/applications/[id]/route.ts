import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminToken } from '@/middleware';

async function getSession(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/admin_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifyAdminToken(token, process.env.ADMIN_SECRET ?? '');
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const session = await getSession(req);

  const updates: Record<string, string> = {};

  if (body.status !== undefined) {
    updates.status = body.status;
  }

  // Recruiter reassignment is only allowed for super_admin or admin
  if (body.recruiter_id !== undefined) {
    const isSuperAdmin = session?.role === 'super_admin' || session?.email === process.env.ADMIN_EMAIL;
    const isAdmin = session?.role === 'admin';
    if (!isSuperAdmin && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    updates.recruiter_id = body.recruiter_id;
    updates.recruiter_name = body.recruiter_name ?? '';
  }

  const { error } = await createAdminClient()
    .from('applications')
    .update(updates)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { error } = await createAdminClient()
    .from('applications')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
