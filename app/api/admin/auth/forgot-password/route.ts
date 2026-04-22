import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createResetToken } from '@/lib/adminResetTokens';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  const { email } = await request.json() as { email: string };
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

  const superAdminEmail = process.env.ADMIN_EMAIL;
  const { data } = await createAdminClient()
    .from('admin_users').select('id').eq('email', email).eq('active', true).single();
  const isValid = email === superAdminEmail || !!data;

  if (isValid) {
    const token = createResetToken(email);
    const origin = new URL(request.url).origin;
    await sendPasswordResetEmail(email, `${origin}/admin/reset-password?token=${token}`, true);
  }

  return NextResponse.json({ success: true });
}
