import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Job } from '@/lib/jobsData';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const fullName = user.user_metadata?.full_name ?? user.email;
  const initials = (fullName as string)
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const { data: jobsRaw } = await createAdminClient().from('jobs').select('*').limit(3);
  const jobs = (jobsRaw ?? []) as Job[];

  async function signOut() {
    'use server';
    const sb = await createClient();
    await sb.auth.signOut();
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{fullName as string}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Verified account
              </span>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Suggested jobs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Open Positions</h2>
          <Link href="/careers" className="text-sm text-brand-600 hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/careers/${job.id}`}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50 transition"
            >
              <div>
                <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{job.company} · {job.vertical}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-brand-600">{job.salary}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
