import { NextResponse } from 'next/server';
import { readAdminUsers, writeAdminUsers, hashPassword, AdminUser, AdminRole } from '@/lib/adminUsers';
import { verifyAdminToken } from '@/middleware';

async function getSuperAdminOnly(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/admin_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return false;
  const session = await verifyAdminToken(token, process.env.ADMIN_SECRET ?? '');
  return session?.role === 'super_admin';
}

export async function GET(request: Request) {
  if (!(await getSuperAdminOnly(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const users = readAdminUsers().map(({ passwordHash: _, ...u }) => u);
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  if (!(await getSuperAdminOnly(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const users = readAdminUsers();

  if (users.some((u) => u.email === body.email)) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  const newUser: AdminUser = {
    id: Date.now().toString(),
    email: String(body.email),
    name: String(body.name ?? ''),
    role: (body.role ?? 'editor') as AdminRole,
    passwordHash: hashPassword(String(body.password ?? 'changeme123')),
    active: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeAdminUsers(users);

  const { passwordHash: _, ...safeUser } = newUser;
  return NextResponse.json(safeUser, { status: 201 });
}
