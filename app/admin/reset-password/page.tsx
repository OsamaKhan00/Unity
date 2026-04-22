'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
        Invalid reset link.{' '}
        <Link href="/admin/forgot-password" className="font-medium underline">Request a new one</Link>
      </div>
    );
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json() as { error?: string };

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.');
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push('/admin/login'), 2500);
  }

  return done ? (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
      Password updated! Redirecting you to sign in…
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition mt-1"
      >
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Set new password</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a strong password for your admin account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <Suspense fallback={<div className="text-sm text-gray-500 text-center">Loading…</div>}>
            <ResetForm />
          </Suspense>
          <p className="text-center text-sm text-gray-500 mt-5">
            <Link href="/admin/login" className="text-brand-600 font-medium hover:underline">Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
