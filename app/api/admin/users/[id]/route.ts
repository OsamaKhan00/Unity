import { NextResponse } from 'next/server';
import { readAdminUsers, writeAdminUsers, hashPassword, AdminRole } from '@/lib/adminUsers';
import { verifyAdminToken } from '@/middleware';

async function isSuperAdmin(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/admin_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return false;
  const session = await verifyAdminToken(token, process.env.ADMIN_SECRET ?? '');
  return session?.role === 'super_admin';
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isSuperAdmin(request))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const users = readAdminUsers();
  const i = users.findIndex((u) => u.id === id);
  if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  users[i] = {
    ...users[i],
    name: body.name ?? users[i].name,
    role: (body.role ?? users[i].role) as AdminRole,
    active: body.active ?? users[i].active,
    ...(body.password ? { passwordHash: hashPassword(body.password) } : {}),
  };

  writeAdminUsers(users);
  const { passwordHash: _, ...safeUser } = users[i];
  return NextResponse.json(safeUser);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isSuperAdmin(request))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const users = readAdminUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeAdminUsers(filtered);
  return NextResponse.json({ success: true });
}
