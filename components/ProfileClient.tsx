'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  phone: string;
  location: string;
  linkedin: string;
  bio: string;
  cv_url: string;
  cv_filename: string;
}

interface Props {
  userId: string;
  email: string;
  initialFullName: string;
}

export default function ProfileClient({ email, initialFullName }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(initialFullName);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: initialFullName, phone: '', location: '', linkedin: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvSuccess, setCvSuccess] = useState(false);

  const initials = (fullName || email)
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then((data: Profile) => {
        setProfile(data);
        setForm(f => ({
          ...f,
          phone: data.phone ?? '',
          location: data.location ?? '',
          linkedin: data.linkedin ?? '',
          bio: data.bio ?? '',
        }));
      });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      setProfile(p => ({ ...p!, ...data }));
      setFullName(form.fullName);
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvUploading(true);
    setCvSuccess(false);

    const fd = new FormData();
    fd.append('cv', file);
    const res = await fetch('/api/profile/cv', { method: 'POST', body: fd });

    if (res.ok) {
      const data = await res.json();
      setProfile(p => ({ ...p!, cv_url: data.cv_url, cv_filename: data.cv_filename }));
      setCvSuccess(true);
      setTimeout(() => setCvSuccess(false), 3000);
    }
    setCvUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  const isComplete = !!profile?.cv_url;

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 space-y-5">

      {/* Incomplete profile banner */}
      {profile !== null && !isComplete && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Complete your profile to apply with one click</p>
            <p className="text-xs text-amber-700 mt-0.5">Upload your CV below and fill in your details. Once complete, you can apply to any job instantly without re-entering your information.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{fullName || email}</h1>
              <p className="text-sm text-gray-500">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Verified account
                </span>
                {isComplete && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Profile complete
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition shrink-0"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Profile Details</h2>
          {!editMode && (
            <button
              onClick={() => { setForm(f => ({ ...f, fullName })); setEditMode(true); }}
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {saveSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg font-medium">
            Profile saved.
          </div>
        )}

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 206 555 0100"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Seattle, WA"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/yourprofile"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Bio (optional)</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Brief summary of your background…"
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3.5">
            <ProfileRow label="Phone" value={profile?.phone} />
            <ProfileRow label="Location" value={profile?.location} />
            <ProfileRow label="LinkedIn" value={profile?.linkedin} link />
            <ProfileRow label="Bio" value={profile?.bio} />
          </div>
        )}
      </div>

      {/* CV */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Your CV / Resume</h2>

        {profile?.cv_url ? (
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{profile.cv_filename || 'CV on file'}</p>
                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
                  View →
                </a>
              </div>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={cvUploading}
              className="text-sm text-brand-600 font-medium hover:underline shrink-0 disabled:opacity-50"
            >
              {cvUploading ? 'Uploading…' : 'Replace'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-3">No CV uploaded yet. Upload one to enable one-click applying.</p>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={cvUploading}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition disabled:opacity-50"
            >
              {cvUploading ? 'Uploading…' : '+ Upload CV (PDF, DOC, DOCX)'}
            </button>
          </div>
        )}

        {cvSuccess && (
          <div className="mt-3 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg font-medium">
            CV updated successfully.
          </div>
        )}

        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvUpload} />
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/careers"
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50 transition"
          >
            <span className="text-sm font-medium text-gray-900">Browse Open Positions</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/my-applications"
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50 transition"
          >
            <span className="text-sm font-medium text-gray-900">My Applications</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

    </div>
  );
}

function ProfileRow({ label, value, link }: { label: string; value?: string; link?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-xs font-medium text-gray-500 w-20 shrink-0 pt-0.5">{label}</span>
      {value ? (
        link ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 hover:underline break-all">
            {value}
          </a>
        ) : (
          <span className="text-sm text-gray-900">{value}</span>
        )
      ) : (
        <span className="text-sm text-gray-400 italic">Not set</span>
      )}
    </div>
  );
}
