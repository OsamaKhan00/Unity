import { NextResponse } from 'next/server';
import { verifyResetToken } from '@/lib/adminResetTokens';
import { readAdminUsers, writeAdminUsers, hashPassword } from '@/lib/adminUsers';

export async function POST(request: Request) {
  const { token, password } = await request.json() as { token: string; password: string };

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const payload = verifyResetToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
  }

  const superAdminEmail = process.env.ADMIN_EMAIL;

  if (payload.email === superAdminEmail) {
    // Super admin password lives in env vars — can't update at runtime
    return NextResponse.json(
      { error: 'Super admin password must be updated via environment variables.' },
      { status: 400 }
    );
  }

  const admins = readAdminUsers();
  const index = admins.findIndex((a) => a.email === payload.email && a.active);
  if (index === -1) {
    return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
  }

  admins[index].passwordHash = hashPassword(password);
  writeAdminUsers(admins);

  return NextResponse.json({ success: true });
}
