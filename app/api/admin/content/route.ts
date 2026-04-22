import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SiteContent } from '@/lib/contentData';

export async function GET() {
  const { data, error } = await createAdminClient()
    .from('site_content').select('data').eq('id', 1).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 500 });
  return NextResponse.json(data.data);
}

export async function PUT(request: Request) {
  const body = await request.json() as Partial<SiteContent>;
  const { data: current, error: readErr } = await createAdminClient()
    .from('site_content').select('data').eq('id', 1).single();
  if (readErr) return NextResponse.json({ error: readErr.message }, { status: 500 });
  const updated = { ...(current?.data ?? {}), ...body };
  const { data, error } = await createAdminClient()
    .from('site_content').upsert({ id: 1, data: updated }).select('data').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.data);
}
