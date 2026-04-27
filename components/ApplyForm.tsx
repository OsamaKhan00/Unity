"use client";

import { useState, useEffect } from "react";

interface ApplyFormProps {
  jobId: string;
  jobTitle: string;
}

interface SavedApplication {
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
}

function getSavedApplication(jobId: string): SavedApplication | null {
  try {
    const stored = localStorage.getItem('appliedJobs');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed[jobId] ?? null;
  } catch {
    return null;
  }
}

function saveApplication(jobId: string, data: SavedApplication) {
  try {
    const stored = localStorage.getItem('appliedJobs');
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[jobId] = data;
    localStorage.setItem('appliedJobs', JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

export default function ApplyForm({ jobId, jobTitle }: ApplyFormProps) {
  const [saved, setSaved] = useState<SavedApplication | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    setSaved(getSavedApplication(jobId));
  }, [jobId]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set('jobId', jobId);
    data.set('jobTitle', jobTitle);

    const res = await fetch('/api/jobs/apply', {
      method: 'POST',
      body: data,
    });

    setLoading(false);

    if (!res.ok) {
      setError('Something went wrong. Please try again.');
      return;
    }

    const json = await res.json();
    // The POST endpoint doesn't return an ID, so we generate one the same way it does
    // Store the form data so edit mode works
    const appData: SavedApplication = {
      applicationId: json.id ?? Date.now().toString(),
      firstName: data.get('firstName') as string,
      lastName: data.get('lastName') as string,
      email: data.get('email') as string,
      phone: (data.get('phone') as string) ?? '',
      coverLetter: (data.get('coverLetter') as string) ?? '',
    };
    saveApplication(jobId, appData);
    setSaved(appData);
  }

  async function handleUpdate(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!saved) return;
    setLoading(true);
    setError('');
    setUpdateSuccess(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch(`/api/jobs/apply/${saved.applicationId}`, {
      method: 'PUT',
      body: data,
    });

    setLoading(false);

    if (!res.ok) {
      setError('Something went wrong. Please try again.');
      return;
    }

    const updatedApp: SavedApplication = {
      ...saved,
      firstName: data.get('firstName') as string,
      lastName: data.get('lastName') as string,
      email: data.get('email') as string,
      phone: (data.get('phone') as string) ?? '',
      coverLetter: (data.get('coverLetter') as string) ?? '',
    };
    saveApplication(jobId, updatedApp);
    setSaved(updatedApp);
    setEditing(false);
    setUpdateSuccess(true);
  }

  // Already applied — show applied state
  if (saved && !editing) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="mt-0.5 shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-800">Application submitted</p>
            <p className="text-green-700 text-sm mt-0.5">
              You applied as <strong>{saved.firstName} {saved.lastName}</strong> ({saved.email}).
              We&apos;ll be in touch soon.
            </p>
          </div>
        </div>

        {updateSuccess && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-sm text-blue-700 font-medium">
            Application updated successfully.
          </div>
        )}

        <button
          onClick={() => { setEditing(true); setUpdateSuccess(false); }}
          className="w-full border border-brand-500 text-brand-600 font-semibold py-3 rounded-lg hover:bg-brand-50 transition"
        >
          Edit Application
        </button>
      </div>
    );
  }

  // Edit mode
  if (saved && editing) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Update your application for <strong>{jobTitle}</strong>.</p>
          <button
            onClick={() => setEditing(false)}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                required
                name="firstName"
                type="text"
                defaultValue={saved.firstName}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                required
                name="lastName"
                type="text"
                defaultValue={saved.lastName}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              required
              name="email"
              type="email"
              defaultValue={saved.email}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
            <input
              name="phone"
              type="tel"
              defaultValue={saved.phone}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload CV <span className="text-gray-400 font-normal">(leave empty to keep existing)</span>
            </label>
            <input
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
            <textarea
              name="coverLetter"
              rows={4}
              defaultValue={saved.coverLetter}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-700 transition disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    );
  }

  // New application form
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            required
            name="firstName"
            type="text"
            placeholder="Jane"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            required
            name="lastName"
            type="text"
            placeholder="Smith"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          required
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
        <input
          name="phone"
          type="tel"
          placeholder="+1 206 555 0100"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV</label>
        <input
          required
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
        <textarea
          name="coverLetter"
          rows={4}
          placeholder="Tell us why you'd be a great fit..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-700 transition disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  );
}
