import crypto from 'crypto';
import type { Permission } from './permissions';

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  passwordHash: string;
  active: boolean;
  createdAt: string;
  permissions: Permission[];
  permissionsUpdatedAt: string | null;
}

export function hashPassword(password: string): string {
  const secret = process.env.ADMIN_SECRET ?? 'fallback-secret';
  return crypto.createHash('sha256').update(password + secret).digest('hex');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adminUserFromRow(r: any): AdminUser {
  return {
    id: r.id,
    email: r.email,
    name: r.name ?? '',
    role: r.role as AdminRole,
    passwordHash: r.password_hash ?? '',
    active: r.active ?? true,
    createdAt: r.created_at ?? new Date().toISOString(),
    permissions: Array.isArray(r.permissions) ? r.permissions : [],
    permissionsUpdatedAt: r.permissions_updated_at ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adminUserToRow(u: AdminUser): any {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    password_hash: u.passwordHash,
    active: u.active,
    created_at: u.createdAt,
    permissions: u.permissions,
    permissions_updated_at: u.permissionsUpdatedAt,
  };
}

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['jobs', 'people', 'projects', 'content', 'users', 'settings'],
  admin:       ['jobs', 'people', 'projects', 'content'],
  editor:      ['jobs', 'people', 'projects', 'content'],
  viewer:      [],
};

export function canAccess(role: AdminRole, section: string): boolean {
  if (role === 'super_admin') return true;
  return ROLE_PERMISSIONS[role]?.includes(section) ?? false;
}
