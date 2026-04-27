import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await req.formData();

  const firstName   = formData.get('firstName') as string;
  const lastName    = formData.get('lastName') as string;
  const email       = formData.get('email') as string;
  const phone       = (formData.get('phone') as string) ?? '';
  const coverLetter = (formData.get('coverLetter') as string) ?? '';
  const cvFile      = formData.get('cv') as File | null;
  const verifyEmail = (formData.get('verifyEmail') as string)?.toLowerCase().trim();

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Verify the application exists and the requester owns it
  const { data: existing, error: fetchError } = await supabase
    .from('applications')
    .select('id, cv_url, email')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  if (verifyEmail && existing.email.toLowerCase() !== verifyEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const updates: Record<string, string> = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    cover_letter: coverLetter,
  };

  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop();
    const path = `${id}-${firstName}-${lastName}-updated.${ext}`;
    const buffer = Buffer.from(await cvFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(path, buffer, { contentType: cvFile.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: 'CV upload failed: ' + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(path);
    updates.cv_url = urlData.publicUrl;
  }

  const { error } = await supabase.from('applications').update(updates).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
