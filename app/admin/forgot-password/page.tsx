'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Forgot password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your admin email to receive a reset link</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                If that email is registered, a reset link has been sent.
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-brand-600 hover:underline"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="admin@apextalentgroup.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition mt-1"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            <Link href="/admin/login" className="text-brand-600 font-medium hover:underline">Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
