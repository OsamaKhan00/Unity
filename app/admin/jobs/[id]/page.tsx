'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  vertical: string;
  salary: string;
  status: string;
  description: string;
  recruiter_id: string;
  recruiter_name: string;
}

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  cv_url: string;
  status: string;
  recruiter_id: string;
  recruiter_name: string;
  created_at: string;
}

interface Recruiter {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminMe {
  email: string;
  role: string;
  name: string;
}

const statusMeta: Record<string, { label: string; cls: string }> = {
  active:  { label: 'Active',   cls: 'bg-green-100 text-green-700' },
  on_hold: { label: 'On Hold',  cls: 'bg-amber-100 text-amber-700' },
  closed:  { label: 'Closed',   cls: 'bg-red-100 text-red-600' },
  draft:   { label: 'Draft',    cls: 'bg-gray-100 text-gray-500' },
};

const appStatusColors: Record<string, string> = {
  new:         'bg-blue-100 text-blue-700',
  reviewed:    'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
};

const APP_STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected'];

const verticalColors: Record<string, string> = {
  'IT & Software':  'bg-blue-100 text-blue-700',
  'Data Center':    'bg-slate-100 text-slate-700',
  'Pharmaceutical': 'bg-emerald-100 text-emerald-700',
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [job, setJob]                   = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recruiters, setRecruiters]     = useState<Recruiter[]>([]);
  const [me, setMe]                     = useState<AdminMe | null>(null);
  const [loading, setLoading]           = useState(true);
  const [expanded, setExpanded]         = useState<string | null>(null);
  const [deleting, setDeleting]         = useState<string | null>(null);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [addLoading, setAddLoading]     = useState(false);
  const [addError, setAddError]         = useState('');
  const [addSuccess, setAddSuccess]     = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/jobs/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/admin/applications?jobId=${id}`).then(r => r.ok ? r.json() : []),
      fetch('/api/admin/recruiters').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/me').then(r => r.ok ? r.json() : null),
    ]).then(([jobData, appsData, recruitersData, meData]) => {
      setJob(jobData);
      setApplications(appsData);
      setRecruiters(recruitersData);
      setMe(meData);
      setLoading(false);
    });
  }, [id]);

  const canReassign = me?.role === 'super_admin' || me?.role === 'admin';

  async function handleStatusChange(appId: string, status: string) {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    await fetch(`/api/admin/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function handleRecruiterChange(appId: string, recruiterId: string) {
    const recruiter = recruiters.find(r => r.id === recruiterId);
    setApplications(prev => prev.map(a =>
      a.id === appId ? { ...a, recruiter_id: recruiterId, recruiter_name: recruiter?.name ?? '' } : a
    ));
    await fetch(`/api/admin/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recruiter_id: recruiterId, recruiter_name: recruiter?.name ?? '' }),
    });
  }

  async function handleDelete(appId: string, name: string) {
    if (!confirm(`Delete application from ${name}?`)) return;
    setDeleting(appId);
    await fetch(`/api/admin/applications/${appId}`, { method: 'DELETE' });
    setApplications(prev => prev.filter(a => a.id !== appId));
    setDeleting(null);
  }

  async function handleAddCandidate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    setAddSuccess(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch(`/api/admin/jobs/${id}/applications`, {
      method: 'POST',
      body: data,
    });

    setAddLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setAddError(json.error ?? 'Something went wrong.');
      return;
    }

    const newApp = await res.json();
    setApplications(prev => [newApp, ...prev]);
    setAddSuccess(true);
    form.reset();
    setTimeout(() => {
      setShowAddForm(false);
      setAddSuccess(false);
    }, 1500);
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-400">Loading…</div>;
  }

  if (!job) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-4">Job not found.</p>
        <Link href="/admin" className="text-brand-600 text-sm font-medium hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  const sm = statusMeta[job.status] ?? statusMeta.active;

  return (
    <div className="p-6 max-w-5xl">

      {/* Breadcrumb / back */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link href="/admin" className="hover:text-gray-800 transition">Dashboard</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{job.title}</span>
      </div>

      {/* Job header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sm.cls}`}>
                {sm.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {job.company}{job.location ? ` · ${job.location}` : ''}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/admin/jobs/${job.id}/edit`}
              className="border border-gray-300 text-gray-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Edit Job
            </Link>
          </div>
        </div>

        {/* Metadata row */}
        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</p>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${job.type === 'Full-time' ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'}`}>
              {job.type}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Vertical</p>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${verticalColors[job.vertical] ?? 'bg-gray-100 text-gray-600'}`}>
              {job.vertical}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Salary / Rate</p>
            <p className="font-medium text-gray-800 text-sm">{job.salary || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Recruiter</p>
            <p className="font-medium text-gray-800 text-sm">{job.recruiter_name || <span className="text-gray-400 font-normal">Unassigned</span>}</p>
          </div>
        </div>
      </div>

      {/* Applications section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-900">Applications</h2>
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {applications.length}
            </span>
          </div>
          <button
            onClick={() => { setShowAddForm(v => !v); setAddError(''); setAddSuccess(false); }}
            className="flex items-center gap-1.5 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Candidate
          </button>
        </div>

        {/* Add Candidate form */}
        {showAddForm && (
          <div className="border-b border-gray-200 bg-brand-50 px-6 py-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Add a manually sourced candidate</p>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                  <input
                    required name="firstName" type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                  <input
                    required name="lastName" type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    required name="email" type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone (optional)</label>
                  <input
                    name="phone" type="tel"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Resume / CV (optional)</label>
                <input
                  name="cv" type="file" accept=".pdf,.doc,.docx"
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-brand-700 hover:file:bg-brand-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes / Cover Letter (optional)</label>
                <textarea
                  name="coverLetter" rows={3}
                  placeholder="Add sourcing notes or paste cover letter text…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none bg-white"
                />
              </div>
              {addError && <p className="text-red-500 text-sm">{addError}</p>}
              {addSuccess && <p className="text-green-600 text-sm font-medium">Candidate added successfully.</p>}
              <div className="flex gap-3">
                <button
                  type="submit" disabled={addLoading}
                  className="bg-brand-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-brand-700 transition disabled:opacity-60 text-sm"
                >
                  {addLoading ? 'Adding…' : 'Add Candidate'}
                </button>
                <button
                  type="button" onClick={() => setShowAddForm(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No applications yet. Use &ldquo;Add Candidate&rdquo; to manually source one.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map(app => (
              <div key={app.id}>
                <div className="flex items-center gap-4 px-6 py-4 flex-wrap hover:bg-gray-50 transition">
                  {/* Candidate info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {app.email}{app.phone ? ` · ${app.phone}` : ''}
                    </p>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-gray-400 shrink-0 hidden sm:block">
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>

                  {/* Recruiter */}
                  {canReassign ? (
                    <select
                      value={app.recruiter_id}
                      onChange={e => handleRecruiterChange(app.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">— Unassigned —</option>
                      {recruiters.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-gray-500 shrink-0">{app.recruiter_name || 'Unassigned'}</span>
                  )}

                  {/* Status */}
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${appStatusColors[app.status] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {APP_STATUSES.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>

                  {/* CV link */}
                  {app.cv_url ? (
                    <a href={app.cv_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-brand-600 hover:underline shrink-0 font-medium">
                      View CV
                    </a>
                  ) : (
                    <span className="text-xs text-gray-300 shrink-0">No CV</span>
                  )}

                  {/* Details toggle */}
                  <button
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                    className="text-xs text-brand-600 hover:underline shrink-0"
                  >
                    {expanded === app.id ? 'Hide' : 'Details'}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(app.id, `${app.first_name} ${app.last_name}`)}
                    disabled={deleting === app.id}
                    className="text-xs text-red-500 hover:text-red-700 shrink-0 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>

                {/* Expanded notes */}
                {expanded === app.id && (
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes / Cover Letter</p>
                    {app.cover_letter ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.cover_letter}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">None provided.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Job Description</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
      </div>

    </div>
  );
}
