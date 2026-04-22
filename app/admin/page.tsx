'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  id: string; title: string; company: string; type: string;
  vertical: string; salary: string;
}

const verticalColors: Record<string, string> = {
  'IT & Software':  'bg-blue-100 text-blue-700',
  'Data Center':    'bg-slate-100 text-slate-700',
  'Pharmaceutical': 'bg-emerald-100 text-emerald-700',
};

export default function AdminDashboard() {
  const [jobs, setJobs]     = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string|null>(null);

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    const r = await fetch('/api/admin/jobs');
    if (r.ok) setJobs(await r.json());
    setLoading(false);
  }

  async function deleteJob(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    await fetch(`/api/admin/jobs/${id}`, { method:'DELETE' });
    setJobs(js => js.filter(j=>j.id!==id));
    setDeleting(null);
  }

  const verticals = ['IT & Software','Data Center','Pharmaceutical'];
  const counts = Object.fromEntries(verticals.map(v=>[v, jobs.filter(j=>j.vertical===v).length]));

  return (
    <div className="p-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { href:'/admin/people',   label:'Manage People',  sub:'Add or edit team members' },
          { href:'/admin/projects', label:'Manage Projects', sub:'Update case studies & engagements' },
          { href:'/admin/content',  label:'Edit Site Copy',  sub:'Update headlines, stats & values' },
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

        {loading ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-gray-500 text-sm mb-3">No job postings yet.</p>
            <Link href="/admin/jobs/new" className="text-brand-600 text-sm font-medium hover:underline">Create your first posting →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Position','Type','Vertical','Salary',''].map(h=>(
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{job.company}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${job.type==='Full-time'?'bg-brand-50 text-brand-700':'bg-amber-50 text-amber-700'}`}>{job.type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${verticalColors[job.vertical]??'bg-gray-100 text-gray-700'}`}>{job.vertical}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{job.salary}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/jobs/${job.id}/edit`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Edit</Link>
                        <button onClick={()=>deleteJob(job.id,job.title)} disabled={deleting===job.id} className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                          {deleting===job.id?'…':'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
