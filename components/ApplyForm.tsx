"use client";

import { useState } from "react";

interface ApplyFormProps {
  jobId: string;
  jobTitle: string;
}

export default function ApplyForm({ jobId, jobTitle }: ApplyFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch('/api/jobs/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        jobTitle,
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        phone: data.get('phone'),
        coverLetter: data.get('coverLetter'),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError('Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="text-green-600 font-semibold text-lg">Application submitted!</p>
        <p className="text-gray-500 text-sm mt-1">
          Thank you for applying for <strong>{jobTitle}</strong>. We will be in touch soon.
        </p>
      </div>
    );
  }

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
        {loading ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
