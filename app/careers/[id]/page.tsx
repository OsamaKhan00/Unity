import Link from "next/link";
import ApplyForm from "@/components/ApplyForm";
import { getJobList, getJobDescriptions } from "@/lib/jobs";

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [jobs, descriptions] = await Promise.all([getJobList(), getJobDescriptions()]);
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Position not found</h1>
        <Link href="/careers" className="text-brand-600 hover:underline">Back to careers</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-10 px-6">
        <Link
          href="/careers"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-700 transition-colors mb-7"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to careers
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
          <div className="flex gap-2 mb-4">
            <span className="text-xs font-medium bg-brand-50 text-brand-700 px-3 py-1 rounded-full">{job.type}</span>
            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{job.vertical}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
          {job.location && <p className="text-gray-500 text-sm mb-1">{job.location}</p>}
          <p className="text-brand-600 font-semibold text-sm mb-6">{job.salary}</p>
          <div className="border-t border-gray-100 pt-6">
            <p className="text-gray-700 leading-relaxed">
              {descriptions[job.id] ?? "Full job description available upon application."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Apply for this Position</h2>
          <ApplyForm jobId={job.id} jobTitle={job.title} />
        </div>
      </div>
    </div>
  );
}
