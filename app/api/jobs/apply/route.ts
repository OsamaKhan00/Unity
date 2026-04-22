import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { jobId, jobTitle, firstName, lastName, email, phone, coverLetter } = body;

  if (!jobId || !firstName || !lastName || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const id = Date.now().toString();
  const supabase = createAdminClient();

  const { error } = await supabase.from('applications').insert({
    id,
    job_id: jobId,
    job_title: jobTitle,
    first_name: firstName,
    last_name: lastName,
    email,
    phone: phone ?? '',
    cover_letter: coverLetter ?? '',
    status: 'new',
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
