import { NextResponse } from 'next/server';
import { verifyResetToken } from '@/lib/adminResetTokens';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashPassword } from '@/lib/adminUsers';

export async function POST(request: Request) {
  const { token, password } = await request.json() as { token: string; password: string };
  if (!token || !password)
    return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });

  const payload = verifyResetToken(token);
  if (!payload) return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });

  if (payload.email === process.env.ADMIN_EMAIL)
    return NextResponse.json({ error: 'Super admin password must be updated via environment variables.' }, { status: 400 });

  const { error } = await createAdminClient()
    .from('admin_users')
    .update({ password_hash: hashPassword(password) })
    .eq('email', payload.email)
    .eq('active', true);
  if (error) return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });

  return NextResponse.json({ success: true });
}
