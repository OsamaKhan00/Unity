import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  passwordHash: string;
  active: boolean;
  createdAt: string;
}

const dataPath = path.join(process.cwd(), 'data', 'admin_users.json');

export function readAdminUsers(): AdminUser[] {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as AdminUser[];
  } catch {
    return [];
  }
}

export function writeAdminUsers(users: AdminUser[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), 'utf-8');
}

export function hashPassword(password: string): string {
  const secret = process.env.ADMIN_SECRET ?? 'fallback-secret';
  return crypto.createHash('sha256').update(password + secret).digest('hex');
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
