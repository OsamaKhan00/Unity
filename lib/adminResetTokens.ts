import crypto from 'crypto';

export function createResetToken(email: string): string {
  const secret = process.env.ADMIN_SECRET ?? '';
  const exp = Date.now() + 15 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyResetToken(token: string): { email: string } | null {
  try {
    const secret = process.env.ADMIN_SECRET ?? '';
    const dotIndex = token.lastIndexOf('.');
    if (dotIndex === -1) return null;
    const payload = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    if (sig !== expectedSig) return null;
    const { email, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() > exp) return null;
    return { email };
  } catch {
    return null;
  }
}
