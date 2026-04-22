import { NextResponse } from 'next/server';
import { createAdminToken } from '@/middleware';
import { readAdminUsers, hashPassword } from '@/lib/adminUsers';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email: string; password: string };

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET ?? '';

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  let role: string | null = null;
  let resolvedEmail = email;

  // Check super admin first
  if (email === adminEmail && password === adminPassword) {
    role = 'super_admin';
  } else {
    // Check admin users file
    const admins = readAdminUsers();
    const admin = admins.find((a) => a.email === email && a.active);
    if (admin && admin.passwordHash === hashPassword(password)) {
      role = admin.role;
      resolvedEmail = admin.email;
    }
  }

  if (!role) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createAdminToken(resolvedEmail, role, secret);

  const response = NextResponse.json({ success: true, role });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response;
}
