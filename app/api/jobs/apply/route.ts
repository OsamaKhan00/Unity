import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendApplicationConfirmationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const jobId       = formData.get('jobId') as string;
  const jobTitle    = formData.get('jobTitle') as string;
  const firstName   = formData.get('firstName') as string;
  const lastName    = formData.get('lastName') as string;
  const email       = formData.get('email') as string;
  const phone       = (formData.get('phone') as string) ?? '';
  const coverLetter = (formData.get('coverLetter') as string) ?? '';
  const cvFile      = formData.get('cv') as File | null;

  if (!jobId || !firstName || !lastName || !email || !cvFile || cvFile.size === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Look up the job to get the assigned recruiter
  const { data: jobData } = await supabase
    .from('jobs')
    .select('recruiter_id, recruiter_name')
    .eq('id', jobId)
    .single();

  const id = Date.now().toString();
  let cv_url = '';

  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop();
    const path = `${id}-${firstName}-${lastName}.${ext}`;
    const buffer = Buffer.from(await cvFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(path, buffer, { contentType: cvFile.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: 'CV upload failed: ' + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(path);
    cv_url = urlData.publicUrl;
  }

  const { error } = await supabase.from('applications').insert({
    id,
    job_id: jobId,
    job_title: jobTitle,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    cover_letter: coverLetter,
    cv_url,
    status: 'new',
    recruiter_id: jobData?.recruiter_id ?? '',
    recruiter_name: jobData?.recruiter_name ?? '',
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fire confirmation email — don't block the response if it fails
  sendApplicationConfirmationEmail(email, { firstName, jobTitle, applicationId: id }).catch(() => {});

  return NextResponse.json({ success: true, id });
}
