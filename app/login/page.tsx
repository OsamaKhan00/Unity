'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Mode = 'candidate' | 'employee';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'employee') {
        // Try admin credentials first
        const adminRes = await fetch('/api/admin/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (adminRes.ok) {
          router.push('/admin');
          return;
        }

        // Try Supabase as internal employee
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }

        const role = data.user?.user_metadata?.role;
        if (role !== 'employee') {
          await supabase.auth.signOut();
          setError('This login is for internal employees only. Job seekers please use the Job Seeker tab.');
          setLoading(false);
          return;
        }

        router.push('/profile');
        router.refresh();
      } else {
        // Job Seeker — Supabase only
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }

        const role = data.user?.user_metadata?.role;
        if (role === 'employee') {
          await supabase.auth.signOut();
          setError('This account belongs to an internal employee. Please use the Internal Employee tab.');
          setLoading(false);
          return;
        }

        router.push('/profile');
        router.refresh();
      }
    } catch {
      setError('Unable to connect. Please check your internet connection or try again later.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your Apex Talent Group account</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {(['candidate', 'employee'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition capitalize ${
                mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'candidate' ? 'Job Seeker' : 'Internal Employee'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {mode === 'employee' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5 text-sm text-blue-700">
              Use your company-issued email to sign in as an internal employee.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
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
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
