'use client';
import { useState, useEffect } from 'react';

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
  created_at: string;
}

const STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected'];

const statusColors: Record<string, string> = {
  new:         'bg-blue-100 text-blue-700',
  reviewed:    'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);
  const [expanded, setExpanded]         = useState<string | null>(null);
  const [deleting, setDeleting]         = useState<string | null>(null);

  useEffect(() => { fetchApplications(); }, []);

  async function fetchApplications() {
    const r = await fetch('/api/admin/applications');
    if (r.ok) setApplications(await r.json());
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: string) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete application from ${name}?`)) return;
    setDeleting(id);
    await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' });
    setApplications(prev => prev.filter(a => a.id !== id));
    setDeleting(null);
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading applications…</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-0.5">{applications.length} total submission{applications.length !== 1 ? 's' : ''}</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          No applications yet. They will appear here when candidates apply.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {app.first_name} {app.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{app.email}{app.phone ? ` · ${app.phone}` : ''}</p>
                </div>

                <div className="hidden sm:block text-xs text-gray-600 min-w-0 max-w-[180px] truncate">
                  {app.job_title}
                </div>

                <div className="text-xs text-gray-400 shrink-0">
                  {new Date(app.created_at).toLocaleDateString()}
                </div>

                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app.id, e.target.value)}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${statusColors[app.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>

                {app.cv_url ? (
                  <a
                    href={app.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-600 hover:underline shrink-0"
                  >
                    View CV
                  </a>
                ) : (
                  <span className="text-xs text-gray-300 shrink-0">No CV</span>
                )}

                <button
                  onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  className="text-xs text-brand-600 hover:underline shrink-0"
                >
                  {expanded === app.id ? 'Hide' : 'Details'}
                </button>

                <button
                  onClick={() => handleDelete(app.id, `${app.first_name} ${app.last_name}`)}
                  disabled={deleting === app.id}
                  className="text-xs text-red-500 hover:text-red-700 shrink-0 disabled:opacity-40"
                >
                  Delete
                </button>
              </div>

              {/* Expanded cover letter */}
              {expanded === app.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cover Letter</p>
                  {app.cover_letter ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.cover_letter}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No cover letter provided.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
