import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const client = createAdminClient();

  // Try filtering by active status; fall back to all jobs if the column doesn't exist yet
  const { data, error } = await client.from('jobs').select('*').eq('status', 'active');
  if (error) {
    const { data: all, error: allErr } = await client.from('jobs').select('*');
    if (allErr) return NextResponse.json({ error: allErr.message }, { status: 500 });
    return NextResponse.json(all ?? []);
  }
  return NextResponse.json(data ?? []);
}
