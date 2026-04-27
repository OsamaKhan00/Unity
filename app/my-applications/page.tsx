'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Application {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  status: string;
  submittedAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Received',
  reviewed: 'Under Review',
  shortlisted: 'Shortlisted',
  rejected: 'Not Moving Forward',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-gray-100 text-gray-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-700',
};

function readLocalApps(): Application[] {
  try {
    const stored = localStorage.getItem('guestApplications');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function syncLocalApp(updated: Application) {
  try {
    const list = readLocalApps();
    const idx = list.findIndex(a => a.applicationId === updated.applicationId);
    if (idx >= 0) list[idx] = { ...list[idx], ...updated };
    localStorage.setItem('guestApplications', JSON.stringify(list));

    // Keep the per-job lookup in sync too
    const appliedStored = localStorage.getItem('appliedJobs');
    const appliedParsed = appliedStored ? JSON.parse(appliedStored) : {};
    if (appliedParsed[updated.jobId]) {
      appliedParsed[updated.jobId] = {
        ...appliedParsed[updated.jobId],
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        coverLetter: updated.coverLetter,
      };
      localStorage.setItem('appliedJobs', JSON.stringify(appliedParsed));
    }
  } catch { /* ignore */ }
}

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccessId, setEditSuccessId] = useState<string | null>(null);

  useEffect(() => {
    setApps(readLocalApps());
    setLoaded(true);
  }, []);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!lookupEmail.trim()) return;
    setLookupLoading(true);
    setLookupError('');

    try {
      const res = await fetch(`/api/jobs/my-applications?email=${encodeURIComponent(lookupEmail.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        setLookupError(json.error ?? 'Something went wrong.');
        setLookupLoading(false);
        return;
      }

      const serverApps: Application[] = (json.applications ?? []).map((a: {
        id: string; job_id: string; job_title: string; first_name: string;
        last_name: string; email: string; phone: string; cover_letter: string;
        status: string; created_at: string;
      }) => ({
        applicationId: a.id,
        jobId: a.job_id,
        jobTitle: a.job_title,
        firstName: a.first_name,
        lastName: a.last_name,
        email: a.email,
        phone: a.phone,
        coverLetter: a.cover_letter,
        status: a.status,
        submittedAt: a.created_at,
      }));

      // Server data is authoritative (has real status); merge with any local-only entries
      setApps(prev => {
        const merged = [...serverApps];
        for (const local of prev) {
          if (!merged.find(a => a.applicationId === local.applicationId)) {
            merged.push(local);
          }
        }
        return merged;
      });
      setLookupDone(true);
    } catch {
      setLookupError('Network error. Please try again.');
    }

    setLookupLoading(false);
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>, app: Application) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccessId(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch(`/api/jobs/apply/${app.applicationId}`, {
      method: 'PUT',
      body: data,
    });

    setEditLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setEditError(json.error === 'Unauthorized' ? 'Email does not match our records.' : 'Something went wrong. Please try again.');
      return;
    }

    const updated: Application = {
      ...app,
      firstName: data.get('firstName') as string,
      lastName: data.get('lastName') as string,
      email: data.get('email') as string,
      phone: (data.get('phone') as string) ?? '',
      coverLetter: (data.get('coverLetter') as string) ?? '',
    };

    setApps(prev => prev.map(a => a.applicationId === app.applicationId ? updated : a));
    syncLocalApp(updated);
    setEditingId(null);
    setEditSuccessId(app.applicationId);
    setTimeout(() => setEditSuccessId(null), 4000);
  }

  if (!loaded) return null;

  const hasApps = apps.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-2">Track and manage the positions you&apos;ve applied to.</p>
        </div>

        {!hasApps && !lookupDone ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center mb-8">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-800 text-lg">No applications on this device</p>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Applications you submit will appear here. Use the lookup below if you applied from another device.
            </p>
            <Link
              href="/careers"
              className="inline-block bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-700 transition text-sm"
            >
              Browse Open Roles
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {apps.map(app => (
              <ApplicationCard
                key={app.applicationId}
                app={app}
                isEditing={editingId === app.applicationId}
                editError={editError}
                editLoading={editLoading}
                showSuccess={editSuccessId === app.applicationId}
                onEdit={() => { setEditingId(app.applicationId); setEditError(''); }}
                onCancelEdit={() => setEditingId(null)}
                onSaveEdit={(e) => handleEdit(e, app)}
              />
            ))}
          </div>
        )}

        {/* Email lookup */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7">
          <h2 className="font-semibold text-gray-900 mb-1">
            {lookupDone ? 'Search again' : 'Applied from another device?'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter the email address you used when applying and we&apos;ll find your applications.
          </p>
          <form onSubmit={handleLookup} className="flex gap-3 flex-wrap sm:flex-nowrap">
            <input
              type="email"
              required
              value={lookupEmail}
              onChange={e => setLookupEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={lookupLoading}
              className="shrink-0 bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition text-sm disabled:opacity-60"
            >
              {lookupLoading ? 'Searching…' : 'Find Applications'}
            </button>
          </form>
          {lookupError && <p className="text-red-500 text-sm mt-3">{lookupError}</p>}
          {lookupDone && !lookupError && (
            <p className="text-sm mt-3 text-green-700 font-medium">
              {apps.length === 0
                ? 'No applications found for that email address.'
                : `Found ${apps.length} application${apps.length !== 1 ? 's' : ''}.`}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

function ApplicationCard({
  app, isEditing, editError, editLoading, showSuccess, onEdit, onCancelEdit, onSaveEdit,
}: {
  app: Application;
  isEditing: boolean;
  editError: string;
  editLoading: boolean;
  showSuccess: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const statusLabel = STATUS_LABELS[app.status] ?? app.status;
  const statusColor = STATUS_COLORS[app.status] ?? 'bg-gray-100 text-gray-700';
  const submittedDate = new Date(app.submittedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">{app.jobTitle}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {app.firstName} {app.lastName} &middot; {app.email}
            </p>
            <p className="text-xs text-gray-400 mt-1">Submitted {submittedDate}</p>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {showSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-700 font-medium">
            Application updated successfully.
          </div>
        )}

        {!isEditing && (
          <div className="flex gap-3 mt-5">
            <button
              onClick={onEdit}
              className="flex-1 border border-brand-500 text-brand-600 font-semibold py-2.5 rounded-lg hover:bg-brand-50 transition text-sm"
            >
              Edit Application
            </button>
            <Link
              href={`/careers/${app.jobId}`}
              className="flex-1 text-center border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              View Job
            </Link>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-gray-700">Edit your application</p>
            <button
              onClick={onCancelEdit}
              className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>

          <form onSubmit={onSaveEdit} className="space-y-4">
            <input type="hidden" name="verifyEmail" value={app.email} />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                <input
                  required
                  name="firstName"
                  type="text"
                  defaultValue={app.firstName}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                <input
                  required
                  name="lastName"
                  type="text"
                  defaultValue={app.lastName}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                required
                name="email"
                type="email"
                defaultValue={app.email}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone (optional)</label>
              <input
                name="phone"
                type="tel"
                defaultValue={app.phone}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                CV <span className="text-gray-400 font-normal">(leave empty to keep existing)</span>
              </label>
              <input
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cover Letter (optional)</label>
              <textarea
                name="coverLetter"
                rows={4}
                defaultValue={app.coverLetter}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            {editError && <p className="text-red-500 text-sm">{editError}</p>}
            <button
              type="submit"
              disabled={editLoading}
              className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-700 transition disabled:opacity-60 text-sm"
            >
              {editLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
