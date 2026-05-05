import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission } from '@/lib/permissionCheck';

export async function GET(request: Request) {
  const check = await requirePermission(request, 'applications.view');
  if (!check.ok) return check.response;

  const supabase = createAdminClient();

  const [{ data: authData }, { data: profiles }, { data: applications }] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from('candidate_profiles').select('*'),
    supabase.from('applications').select('email'),
  ]);

  const users = (authData?.users ?? []).filter(
    u => u.user_metadata?.role === 'candidate'
  );

  const profileMap = new Map((profiles ?? []).map(p => [p.user_id, p]));

  const appCountMap = new Map<string, number>();
  for (const app of (applications ?? [])) {
    appCountMap.set(app.email, (appCountMap.get(app.email) ?? 0) + 1);
  }

  const candidates = users
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(u => ({
      id: u.id,
      email: u.email ?? '',
      fullName: (u.user_metadata?.full_name as string) ?? '',
      createdAt: u.created_at,
      profile: profileMap.get(u.id) ?? null,
      applicationCount: appCountMap.get(u.email ?? '') ?? 0,
    }));

  return NextResponse.json(candidates);
}
