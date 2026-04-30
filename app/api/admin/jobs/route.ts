import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission } from '@/lib/permissionCheck';
import { Job } from '@/lib/jobsData';

export async function GET(request: Request) {
  const check = await requirePermission(request, 'jobs.view');
  if (!check.ok) return check.response;

  const { data, error } = await createAdminClient().from('jobs').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const check = await requirePermission(request, 'jobs.create');
  if (!check.ok) return check.response;

  const body = await request.json() as Partial<Job> & { recruiter_id?: string; recruiter_name?: string };
  const newJob = {
    id: Date.now().toString(),
    title: String(body.title ?? ''),
    company: String(body.company ?? ''),
    location: String(body.location ?? ''),
    type: String(body.type ?? 'Full-time'),
    vertical: String(body.vertical ?? 'IT & Software'),
    salary: String(body.salary ?? ''),
    description: String(body.description ?? ''),
    status: String(body.status ?? 'active'),
    recruiter_id: String(body.recruiter_id ?? ''),
    recruiter_name: String(body.recruiter_name ?? ''),
  };
  const { data, error } = await createAdminClient()
    .from('jobs').insert(newJob).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
