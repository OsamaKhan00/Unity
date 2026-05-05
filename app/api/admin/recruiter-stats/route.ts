import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission } from '@/lib/permissionCheck';

interface AppRow {
  id: string;
  recruiter_id: string;
  recruiter_name: string;
  status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  job_id: string;
  cv_url: string;
}

export async function GET(request: Request) {
  const check = await requirePermission(request, 'applications.view');
  if (!check.ok) return check.response;

  const supabase = createAdminClient();

  const [{ data: applications }, { data: adminUsers }] = await Promise.all([
    supabase
      .from('applications')
      .select('id, recruiter_id, recruiter_name, status, created_at, first_name, last_name, email, job_title, job_id, cv_url')
      .order('created_at', { ascending: false }),
    supabase
      .from('admin_users')
      .select('id, name, email, role')
      .eq('active', true),
  ]);

  const apps = (applications ?? []) as AppRow[];
  const users = (adminUsers ?? []) as { id: string; name: string; email: string; role: string }[];

  const stats = users.map(user => {
    const userApps = apps.filter(a => a.recruiter_id === user.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      total: userApps.length,
      new: userApps.filter(a => a.status === 'new').length,
      reviewed: userApps.filter(a => a.status === 'reviewed').length,
      shortlisted: userApps.filter(a => a.status === 'shortlisted').length,
      placed: userApps.filter(a => a.status === 'placed').length,
      rejected: userApps.filter(a => a.status === 'rejected').length,
      applications: userApps,
    };
  });

  const assignedIds = new Set(users.map(u => u.id));
  const unassigned = apps.filter(a => !a.recruiter_id || !assignedIds.has(a.recruiter_id));

  return NextResponse.json({ stats, unassigned });
}
