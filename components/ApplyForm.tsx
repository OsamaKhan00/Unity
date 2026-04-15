"use client";

import { useState } from "react";

interface ApplyFormProps {
  jobId: string;
  jobTitle: string;
}

export default function ApplyForm({ jobTitle }: ApplyFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up to Supabase
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
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
            type="text"
            placeholder="Jane"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            required
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
          type="email"
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
        <input
          type="tel"
          placeholder="+44 7700 900000"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV</label>
        <input
          required
          type="file"
          accept=".pdf,.doc,.docx"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
        <textarea
          rows={4}
          placeholder="Tell us why you'd be a great fit..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>
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
