import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission } from '@/lib/permissionCheck';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const check = await requirePermission(req, 'applications.edit');
  if (!check.ok) return check.response;

  const { id: jobId } = await params;
  const supabase = createAdminClient();

  const { data: job } = await supabase
    .from('jobs')
    .select('title, recruiter_id, recruiter_name')
    .eq('id', jobId)
    .single();

  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  const formData = await req.formData();
  const firstName   = formData.get('firstName') as string;
  const lastName    = formData.get('lastName') as string;
  const email       = formData.get('email') as string;
  const phone       = (formData.get('phone') as string) ?? '';
  const coverLetter = (formData.get('coverLetter') as string) ?? '';
  const cvFile      = formData.get('cv') as File | null;

  if (!firstName || !lastName || !email)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const id = Date.now().toString();
  let cv_url = '';

  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop();
    const path = `${id}-${firstName}-${lastName}.${ext}`;
    const buffer = Buffer.from(await cvFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(path, buffer, { contentType: cvFile.type, upsert: false });

    if (uploadError)
      return NextResponse.json({ error: 'CV upload failed: ' + uploadError.message }, { status: 500 });

    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(path);
    cv_url = urlData.publicUrl;
  }

  const { data, error } = await supabase.from('applications').insert({
    id,
    job_id: jobId,
    job_title: job.title,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    cover_letter: coverLetter,
    cv_url,
    status: 'new',
    recruiter_id: job.recruiter_id ?? '',
    recruiter_name: job.recruiter_name ?? '',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
