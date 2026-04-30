import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission } from '@/lib/permissionCheck';
import { Project, projectFromRow, projectToRow } from '@/lib/contentData';

export async function GET(request: Request) {
  const check = await requirePermission(request, 'projects.view');
  if (!check.ok) return check.response;

  const { data, error } = await createAdminClient()
    .from('projects').select('*').order('year', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(projectFromRow));
}

export async function POST(request: Request) {
  const check = await requirePermission(request, 'projects.manage');
  if (!check.ok) return check.response;

  const body = await request.json() as Partial<Project>;
  const newProject: Project = {
    id: Date.now().toString(),
    title: String(body.title ?? ''),
    client: String(body.client ?? ''),
    vertical: String(body.vertical ?? 'IT & Software'),
    outcome: String(body.outcome ?? ''),
    year: String(body.year ?? new Date().getFullYear()),
    imageUrl: String(body.imageUrl ?? ''),
    featured: body.featured === true,
    active: body.active !== false,
  };
  const { data, error } = await createAdminClient()
    .from('projects').insert(projectToRow(newProject)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(projectFromRow(data), { status: 201 });
}
