import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission, getSessionFromHeaders } from '@/lib/permissionCheck';

export async function GET(request: Request) {
  const check = await requirePermission(request, 'applications.view');
  if (!check.ok) return check.response;

  const session = getSessionFromHeaders(request);
  const role = session?.role ?? '';
  const email = session?.email ?? '';

  const jobId = new URL(request.url).searchParams.get('jobId');
  const isSuperAdmin = role === 'super_admin';
  const isAdmin      = role === 'admin';
  const isEditor     = role === 'editor';

  let query = createAdminClient()
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (jobId) query = query.eq('job_id', jobId);

  // Viewers only see applications assigned to them
  if (!isSuperAdmin && !isAdmin && !isEditor) {
    const { data: recruiterRow } = await createAdminClient()
      .from('admin_users')
      .select('id')
      .eq('email', email)
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
