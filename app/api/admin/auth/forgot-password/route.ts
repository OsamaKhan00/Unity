import { NextResponse } from 'next/server';
import { readAdminUsers } from '@/lib/adminUsers';
import { createResetToken } from '@/lib/adminResetTokens';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  const { email } = await request.json() as { email: string };

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const superAdminEmail = process.env.ADMIN_EMAIL;
  const admins = readAdminUsers();
  const isValid =
    email === superAdminEmail ||
    admins.some((a) => a.email === email && a.active);

  // Always return success to prevent email enumeration
  if (isValid) {
    const token = createResetToken(email);
    const origin = new URL(request.url).origin;
    const resetUrl = `${origin}/admin/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl, true);
  }

  return NextResponse.json({ success: true });
}
