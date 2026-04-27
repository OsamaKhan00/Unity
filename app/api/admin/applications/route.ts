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

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const isSuperAdmin = session.role === 'super_admin' || session.email === process.env.ADMIN_EMAIL;
  const isAdmin = session.role === 'admin';

  let query = createAdminClient()
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  // Viewers only see their own assigned applications
  const isEditor = session.role === 'editor';
  if (!isSuperAdmin && !isAdmin && !isEditor) {
    const { data: recruiterRow } = await createAdminClient()
      .from('admin_users')
      .select('id')
      .eq('email', session.email)
      .single();

    if (recruiterRow) {
      query = query.eq('recruiter_id', recruiterRow.id);
    } else {
      return NextResponse.json([]);
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
