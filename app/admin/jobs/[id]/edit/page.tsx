'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import JobForm from '@/components/admin/JobForm';

interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  vertical: string;
  salary: string;
  description: string;
}

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/jobs/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setJob(data);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link href="/admin" className="text-sm text-brand-600 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Job Posting</h2>

        {loading && (
          <p className="text-sm text-gray-400">Loading…</p>
        )}
        {notFound && (
          <p className="text-sm text-red-600">Job not found.</p>
        )}
        {job && (
          <JobForm jobId={id} initialData={job} />
        )}
      </div>
    </div>
  );
}
