import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await createAdminClient()
    .from('candidate_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json(data ?? {
    user_id: user.id, phone: '', location: '', linkedin: '', bio: '', cv_url: '', cv_filename: '',
  });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  if (body.fullName) {
    await supabase.auth.updateUser({ data: { full_name: body.fullName } });
  }

  const { data, error } = await createAdminClient()
    .from('candidate_profiles')
    .upsert({
      user_id: user.id,
      phone: String(body.phone ?? ''),
      location: String(body.location ?? ''),
      linkedin: String(body.linkedin ?? ''),
      bio: String(body.bio ?? ''),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
