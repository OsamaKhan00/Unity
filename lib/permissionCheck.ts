// Server-only — imports DB client. Never import this in client components.
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_PERMISSIONS } from './permissions';
import type { Permission } from './permissions';

type CheckResult = { ok: true } | { ok: false; response: Response };

/**
 * Guards an API route handler by checking the caller has the required permission.
 *
 * Resolution order:
 *   1. super_admin  → always passes, no DB call
 *   2. DB permissions column exists and is populated → use those values
 *   3. DB permissions column is null/missing (migration pending) → fall back to
 *      role-based DEFAULT_PERMISSIONS so the portal stays usable while migrating
 *   4. User inactive or not found → 401
 */
export async function requirePermission(
  request: Request,
  permission: Permission
): Promise<CheckResult> {
  const role  = request.headers.get('x-admin-role');
  const email = request.headers.get('x-admin-email');

  if (!role || !email) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  // Super admin bypasses every permission check — no DB query needed
  if (role === 'super_admin') return { ok: true };

  // --- Fetch user with permissions column (post-migration) ---
  const { data, error: dbErr } = await createAdminClient()
    .from('admin_users')
    .select('active, role, permissions')
    .eq('email', email)
    .single();

  let active: boolean;
  let userRole: string;
  let perms: Permission[];

  if (data) {
    active   = data.active;
    userRole = data.role as string;
    // If permissions column exists and is populated, use it.
    // If it's null (migration run but column not yet populated), fall back to role defaults.
    perms = Array.isArray(data.permissions) && data.permissions.length > 0
      ? (data.permissions as Permission[])
      : (DEFAULT_PERMISSIONS[data.role as string] ?? []);
  } else if (dbErr) {
    // permissions column likely doesn't exist yet — retry without it
    const { data: basic } = await createAdminClient()
      .from('admin_users')
      .select('active, role')
      .eq('email', email)
      .single();

    if (!basic) {
      return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }
    active   = basic.active;
    userRole = basic.role as string;
    perms    = DEFAULT_PERMISSIONS[userRole] ?? [];
  } else {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (!active) {
    return { ok: false, response: NextResponse.json({ error: 'Account suspended' }, { status: 401 }) };
  }

  if (!perms.includes(permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: `Forbidden: '${permission}' permission required` },
        { status: 403 }
      ),
    };
  }

  return { ok: true };
}

/** Returns true if the request is from a verified super admin. */
export function isSuperAdminRequest(request: Request): boolean {
  return request.headers.get('x-admin-role') === 'super_admin';
}

/** Resolves session info from middleware-injected headers. */
export function getSessionFromHeaders(request: Request) {
  const role  = request.headers.get('x-admin-role');
  const email = request.headers.get('x-admin-email');
  if (!role || !email) return null;
  return { role, email };
}
