'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Job {
  id: string; title: string; company: string; location: string; type: string;
  vertical: string; salary: string; status: string; recruiter_name: string;
}

const verticalColors: Record<string, string> = {
  'IT & Software':  'bg-blue-100 text-blue-700',
  'Data Center':    'bg-slate-100 text-slate-700',
  'Pharmaceutical': 'bg-emerald-100 text-emerald-700',
};

const statusMeta: Record<string, { label: string; cls: string }> = {
  active:  { label: 'Active',   cls: 'bg-green-100 text-green-700' },
  on_hold: { label: 'On Hold',  cls: 'bg-amber-100 text-amber-700' },
  closed:  { label: 'Closed',   cls: 'bg-red-100 text-red-600' },
  draft:   { label: 'Draft',    cls: 'bg-gray-100 text-gray-500' },
};

const STATUS_TABS = ['All', 'Active', 'On Hold', 'Closed', 'Draft'] as const;
type StatusTab = typeof STATUS_TABS[number];

function tabToStatusValue(tab: StatusTab): string | null {
  if (tab === 'All') return null;
  return tab.toLowerCase().replace(' ', '_');
}

export default function AdminDashboard() {
  const [jobs, setJobs]         = useState<Job[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<StatusTab>('All');
  const [appCount, setAppCount] = useState<number | null>(null);

  useEffect(() => {
    fetchJobs();
    fetch('/api/admin/applications')
      .then(r => r.ok ? r.json() : [])
      .then((data: unknown[]) => setAppCount(data.length))
      .catch(() => {});
  }, []);

  async function fetchJobs() {
    const r = await fetch('/api/admin/jobs');
    if (r.ok) setJobs(await r.json());
    setLoading(false);
  }

  async function deleteJob(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
    setJobs(js => js.filter(j => j.id !== id));
    setDeleting(null);
  }

  const verticals = ['IT & Software', 'Data Center', 'Pharmaceutical'];
  const counts = Object.fromEntries(verticals.map(v => [v, jobs.filter(j => j.vertical === v).length]));
  const statusCounts = Object.fromEntries(
    Object.keys(statusMeta).map(s => [s, jobs.filter(j => (j.status || 'active') === s).length])
  );

  const filteredJobs = useMemo(() => {
    const val = tabToStatusValue(statusTab);
    if (!val) return jobs;
    return jobs.filter(j => (j.status || 'active') === val);
  }, [jobs, statusTab]);

  return (
    <div className="p-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Jobs</p>
          <p className="text-3xl font-extrabold text-gray-900">{jobs.length}</p>
        </div>
        {verticals.map(v => (
          <div key={v} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 leading-tight">{v}</p>
            <p className="text-3xl font-extrabold text-gray-900">{counts[v] ?? 0}</p>
          </div>
        ))}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Applications</p>
          <p className="text-3xl font-extrabold text-gray-900">
            {appCount === null ? <span className="text-gray-300">…</span> : appCount}
          </p>
        </div>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(statusMeta).map(([key, { label, cls }]) => (
          <div key={key} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${cls}`}>
            <span>{label}</span>
            <span className="font-bold">{statusCounts[key] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/admin/people',    label: 'Manage People',   sub: 'Add or edit team members' },
          { href: '/admin/projects',  label: 'Manage Projects', sub: 'Update case studies & engagements' },
          { href: '/admin/content',   label: 'Edit Site Copy',  sub: 'Update headlines, stats & values' },
        ].map(q => (
          <Link key={q.href} href={q.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-400 hover:shadow-sm transition group">
            <p className="font-semibold text-gray-900 text-sm group-hover:text-brand-700 transition">{q.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{q.sub}</p>
          </Link>
        ))}
      </div>

      {/* Jobs table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Job Postings</h2>
          <Link href="/admin/jobs/new" className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium">
            + Add Job
          </Link>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 px-4 pt-3 pb-0 border-b border-gray-200">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition -mb-px border-b-2 ${
                statusTab === tab
                  ? 'border-brand-600 text-brand-700 bg-brand-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-1.5 text-[10px] bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5">
                  {statusCounts[tabToStatusValue(tab)!] ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">Loading…</div>
        ) : filteredJobs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-gray-500 text-sm mb-3">
              {statusTab === 'All' ? 'No job postings yet.' : `No ${statusTab.toLowerCase()} jobs.`}
            </p>
            {statusTab === 'All' && (
              <Link href="/admin/jobs/new" className="text-brand-600 text-sm font-medium hover:underline">Create your first posting →</Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Position & Company', 'Recruiter', 'Status', 'Type', 'Vertical', 'Salary', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredJobs.map(job => {
                  const sm = statusMeta[job.status || 'active'] ?? statusMeta.active;
                  return (
                    <tr key={job.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <Link href={`/admin/jobs/${job.id}`} className="font-medium text-gray-900 text-sm hover:text-brand-700 transition">{job.title}</Link>
                        <p className="text-xs text-gray-400 mt-0.5">{job.company}{job.location ? ` · ${job.location}` : ''}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{job.recruiter_name || <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sm.cls}`}>{sm.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${job.type === 'Full-time' ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'}`}>{job.type}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${verticalColors[job.vertical] ?? 'bg-gray-100 text-gray-700'}`}>{job.vertical}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{job.salary}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/admin/jobs/${job.id}`} className="text-sm text-gray-500 hover:text-gray-700 font-medium">View</Link>
                          <Link href={`/admin/jobs/${job.id}/edit`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Edit</Link>
                          <button onClick={() => deleteJob(job.id, job.title)} disabled={deleting === job.id} className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                            {deleting === job.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
