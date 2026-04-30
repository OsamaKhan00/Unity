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
  recruiter_name: string;
}

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  recruiter_name: string;
  recruiter_id: string;
}

interface FolderGroup {
  name: string;
  jobs: Job[];
}

const statusMeta: Record<string, { label: string; cls: string }> = {
  active:  { label: 'Active',   cls: 'bg-green-100 text-green-700' },
  on_hold: { label: 'On Hold',  cls: 'bg-amber-100 text-amber-700' },
  closed:  { label: 'Closed',   cls: 'bg-red-100 text-red-600' },
  draft:   { label: 'Draft',    cls: 'bg-gray-100 text-gray-500' },
};

const verticalColors: Record<string, string> = {
  'IT & Software':  'bg-blue-100 text-blue-700',
  'Data Center':    'bg-slate-100 text-slate-700',
  'Pharmaceutical': 'bg-emerald-100 text-emerald-700',
};

// Group jobs by a field on the job record (used for companies)
function groupJobsByField(jobs: Job[], key: keyof Job, fallback: string): FolderGroup[] {
  const map = new Map<string, Job[]>();
  for (const job of jobs) {
    const k = (job[key] as string)?.trim() || fallback;
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(job);
  }
  return [...map.entries()]
    .sort(([a], [b]) => {
      if (a === fallback) return 1;
      if (b === fallback) return -1;
      return a.localeCompare(b);
    })
    .map(([name, jobs]) => ({ name, jobs }));
}

// Build recruiter folders from applications — groups unique jobs under each recruiter
function buildRecruiterGroups(applications: Application[], jobsById: Map<string, Job>): FolderGroup[] {
  // Map: recruiter_name → Set of job_ids
  const recruiterJobs = new Map<string, Set<string>>();
  for (const app of applications) {
    const recruiter = app.recruiter_name?.trim() || 'Unassigned';
    if (!recruiterJobs.has(recruiter)) recruiterJobs.set(recruiter, new Set());
    if (app.job_id) recruiterJobs.get(recruiter)!.add(app.job_id);
  }

  return [...recruiterJobs.entries()]
    .sort(([a], [b]) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b);
    })
    .map(([name, jobIds]) => ({
      name,
      jobs: [...jobIds]
        .map(id => jobsById.get(id))
        .filter(Boolean) as Job[],
    }))
    .filter(g => g.jobs.length > 0);
}

function FolderIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-5 h-5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 12h-15a4.483 4.483 0 00-3 1.146z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 12h-15a4.483 4.483 0 00-3 1.146z" />
    </svg>
  );
}

function JobRow({ job }: { job: Job }) {
  const sm = statusMeta[job.status] ?? statusMeta.active;
  const vc = verticalColors[job.vertical] ?? 'bg-gray-100 text-gray-600';

  return (
    <Link
      href={`/admin/jobs/${job.id}`}
      className="flex items-center gap-3 pl-11 pr-4 py-2.5 hover:bg-brand-50 transition group border-t border-gray-100 first:border-t-0"
    >
      <svg className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-brand-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>

      <span className="flex-1 min-w-0 text-sm text-gray-800 font-medium truncate group-hover:text-brand-700 transition">
        {job.title}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sm.cls}`}>
          {sm.label}
        </span>
        <span className={`hidden sm:inline text-[11px] font-medium px-2 py-0.5 rounded-full ${vc}`}>
          {job.vertical}
        </span>
        <span className="hidden md:inline text-[11px] text-gray-400">{job.type}</span>
      </div>
    </Link>
  );
}

function FolderTree({
  groups,
  openSet,
  onToggle,
}: {
  groups: FolderGroup[];
  openSet: Set<string>;
  onToggle: (name: string) => void;
}) {
  if (groups.length === 0) {
    return <p className="text-sm text-gray-400 px-4 py-6 text-center">No jobs yet.</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {groups.map(({ name, jobs }) => {
        const open = openSet.has(name);
        return (
          <div key={name}>
            <button
              onClick={() => onToggle(name)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
            >
              <svg
                className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>

              <FolderIcon open={open} />

              <span className="flex-1 min-w-0 text-sm font-semibold text-gray-800 truncate">
                {name}
              </span>

              <span className="shrink-0 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
              </span>
            </button>

            {open && (
              <div className="bg-gray-50">
                {jobs.map(job => <JobRow key={job.id} job={job} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Section({
  title,
  icon,
  groups,
  openSet,
  onToggle,
  onExpandAll,
  onCollapseAll,
}: {
  title: string;
  icon: React.ReactNode;
  groups: FolderGroup[];
  openSet: Set<string>;
  onToggle: (name: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) {
  const allOpen = groups.length > 0 && groups.every(g => openSet.has(g.name));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2.5">
          <span className="text-gray-500">{icon}</span>
          <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
          <span className="text-[11px] font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
            {groups.length} {groups.length === 1 ? 'folder' : 'folders'}
          </span>
        </div>
        <button
          onClick={allOpen ? onCollapseAll : onExpandAll}
          className="text-xs text-brand-600 hover:text-brand-800 font-medium transition"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <FolderTree groups={groups} openSet={openSet} onToggle={onToggle} />
    </div>
  );
}

export default function FoldersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [recruiterOpen, setRecruiterOpen] = useState<Set<string>>(new Set());
  const [companyOpen, setCompanyOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/jobs').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/applications').then(r => r.ok ? r.json() : []),
    ]).then(([jobsData, appsData]) => {
      setJobs(jobsData);
      setApplications(appsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const jobsById = useMemo(() => new Map(jobs.map(j => [j.id, j])), [jobs]);

  // Recruiter folders: built from applications so recruiter assignments are reflected live
  const recruiterGroups = useMemo(
    () => buildRecruiterGroups(applications, jobsById),
    [applications, jobsById]
  );

  // Company folders: built from jobs
  const companyGroups = useMemo(
    () => groupJobsByField(jobs, 'company', 'Unknown'),
    [jobs]
  );

  function toggle(set: Set<string>, name: string): Set<string> {
    const next = new Set(set);
    next.has(name) ? next.delete(name) : next.add(name);
    return next;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Folders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Jobs organised by recruiter and company — updates automatically as assignments change.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium"
        >
          + Add Job
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm animate-pulse">Loading folders…</div>
      ) : (
        <>
          {/* Recruiter folders — sourced from application recruiter assignments */}
          <Section
            title="Recruiters"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
            groups={recruiterGroups}
            openSet={recruiterOpen}
            onToggle={name => setRecruiterOpen(s => toggle(s, name))}
            onExpandAll={() => setRecruiterOpen(new Set(recruiterGroups.map(g => g.name)))}
            onCollapseAll={() => setRecruiterOpen(new Set())}
          />

          {/* Company folders — sourced from job company field */}
          <Section
            title="Companies"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            }
            groups={companyGroups}
            openSet={companyOpen}
            onToggle={name => setCompanyOpen(s => toggle(s, name))}
            onExpandAll={() => setCompanyOpen(new Set(companyGroups.map(g => g.name)))}
            onCollapseAll={() => setCompanyOpen(new Set())}
          />
        </>
      )}
    </div>
  );
}
