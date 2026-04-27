'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  vertical: string;
  salary: string;
  status: string;
}

const verticalColors: Record<string, string> = {
  'IT & Software':  'bg-blue-100 text-blue-700',
  'Data Center':    'bg-slate-100 text-slate-700',
  'Pharmaceutical': 'bg-emerald-100 text-emerald-700',
};

const statusMeta: Record<string, { label: string; cls: string }> = {
  active:  { label: 'Active',  cls: 'bg-green-100 text-green-700' },
  on_hold: { label: 'On Hold', cls: 'bg-amber-100 text-amber-700' },
  closed:  { label: 'Closed',  cls: 'bg-red-100 text-red-600' },
  draft:   { label: 'Draft',   cls: 'bg-gray-100 text-gray-500' },
};

export default function CompaniesPage() {
  const [jobs, setJobs]       = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/jobs')
      .then(r => r.ok ? r.json() : [])
      .then((data: Job[]) => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Group jobs by company
  const companies = useMemo(() => {
    const map = new Map<string, Job[]>();
    for (const job of jobs) {
      const key = job.company || 'Unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(job);
    }
    return Array.from(map.entries())
      .map(([name, positions]) => ({ name, positions }))
      .sort((a, b) => b.positions.length - a.positions.length);
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(c => c.name.toLowerCase().includes(q));
  }, [companies, search]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Companies & Positions</h1>
        <p className="text-sm text-gray-500 mt-0.5">View all vendor/client companies and the roles associated with each.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Companies</p>
          <p className="text-3xl font-extrabold text-gray-900">{companies.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Positions</p>
          <p className="text-3xl font-extrabold text-gray-900">{jobs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Active Positions</p>
          <p className="text-3xl font-extrabold text-gray-900">{jobs.filter(j => (j.status || 'active') === 'active').length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search companies…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">
          {search ? `No companies matching "${search}".` : 'No companies found.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ name, positions }) => {
            const isOpen = expanded === name;
            const activeCount = positions.filter(p => (p.status || 'active') === 'active').length;
            return (
              <div key={name} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Company header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : name)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {positions.length} {positions.length === 1 ? 'position' : 'positions'}
                        {activeCount > 0 && (
                          <span className="ml-2 text-green-600 font-medium">{activeCount} active</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Vertical chips preview */}
                    <div className="hidden sm:flex gap-1.5 flex-wrap justify-end max-w-xs">
                      {Array.from(new Set(positions.map(p => p.vertical))).map(v => (
                        <span key={v} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${verticalColors[v] ?? 'bg-gray-100 text-gray-600'}`}>{v}</span>
                      ))}
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Expanded positions list */}
                {isOpen && (
                  <div className="border-t border-gray-100">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Position', 'Location', 'Status', 'Type', 'Vertical', 'Salary', ''].map(h => (
                            <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider last:text-right">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {positions.map(job => {
                          const sm = statusMeta[job.status || 'active'] ?? statusMeta.active;
                          return (
                            <tr key={job.id} className="hover:bg-gray-50 transition">
                              <td className="px-5 py-3 text-sm font-medium text-gray-900">{job.title}</td>
                              <td className="px-5 py-3 text-sm text-gray-500">{job.location || '—'}</td>
                              <td className="px-5 py-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sm.cls}`}>{sm.label}</span>
                              </td>
                              <td className="px-5 py-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${job.type === 'Full-time' ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'}`}>{job.type}</span>
                              </td>
                              <td className="px-5 py-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${verticalColors[job.vertical] ?? 'bg-gray-100 text-gray-600'}`}>{job.vertical}</span>
                              </td>
                              <td className="px-5 py-3 text-sm text-gray-600">{job.salary}</td>
                              <td className="px-5 py-3 text-right">
                                <Link href={`/admin/jobs/${job.id}/edit`} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Edit</Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
