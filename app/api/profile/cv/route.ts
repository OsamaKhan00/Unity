import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const cvFile = formData.get('cv') as File | null;
  if (!cvFile || cvFile.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const ext = cvFile.name.split('.').pop();
  const path = `profile-${user.id}.${ext}`;
  const buffer = Buffer.from(await cvFile.arrayBuffer());
  const admin = createAdminClient();

  const { error: uploadError } = await admin.storage
    .from('cvs')
    .upload(path, buffer, { contentType: cvFile.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from('cvs').getPublicUrl(path);
  const cv_url = urlData.publicUrl;
  const cv_filename = cvFile.name;

  const { error: dbError } = await admin
    .from('candidate_profiles')
    .upsert(
      { user_id: user.id, cv_url, cv_filename, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ cv_url, cv_filename });
}
