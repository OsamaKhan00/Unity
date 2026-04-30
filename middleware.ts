import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Token format: base64(JSON({email,role,iat})).hmac
async function hmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createAdminToken(
  email: string,
  role: string,
  secret: string
): Promise<string> {
  const payload = btoa(JSON.stringify({ email, role, iat: Date.now() }));
  const sig = await hmac(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(
  token: string,
  secret: string
): Promise<{ email: string; role: string } | null> {
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return null;
    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expectedSig = await hmac(payload, secret);
    if (sig !== expectedSig) return null;
    const { email, role, iat } = JSON.parse(atob(payload));
    if (Date.now() - iat > 24 * 60 * 60 * 1000) return null;
    return { email, role };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow auth API endpoints
  if (pathname.startsWith('/api/admin/auth')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();
  if (pathname === '/admin/forgot-password') return NextResponse.next();
  if (pathname === '/admin/reset-password') return NextResponse.next();

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const secret = process.env.ADMIN_SECRET ?? '';
    const token = request.cookies.get('admin_token')?.value;
    const session = token ? await verifyAdminToken(token, secret) : null;

    if (!session) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Forward role + email as REQUEST headers so API route handlers can read them
    // without re-verifying the token on every request.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-role', session.role);
    requestHeaders.set('x-admin-email', session.email);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
