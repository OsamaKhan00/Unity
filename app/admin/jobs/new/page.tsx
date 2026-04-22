import Link from 'next/link';
import JobForm from '@/components/admin/JobForm';

export default function NewJobPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link href="/admin" className="text-sm text-brand-600 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">New Job Posting</h2>
        <JobForm />
      </div>
    </div>
  );
}
