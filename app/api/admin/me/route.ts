import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/middleware';
import { readAdminUsers } from '@/lib/adminUsers';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/admin_token=([^;]+)/);
  const token = match?.[1];

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await verifyAdminToken(token, process.env.ADMIN_SECRET ?? '');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const superAdminEmail = process.env.ADMIN_EMAIL;
  if (session.email === superAdminEmail) {
    return NextResponse.json({ email: session.email, role: 'super_admin', name: 'Super Admin' });
  }

  const admins = readAdminUsers();
  const admin = admins.find((a) => a.email === session.email);
  return NextResponse.json({
    email: session.email,
    role: session.role,
    name: admin?.name ?? session.email,
  });
}
