import Link from "next/link";
import ApplyForm from "@/components/ApplyForm";
import { getJobList, getJobDescriptions } from "@/lib/jobs";

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobs = getJobList();
  const descriptions = getJobDescriptions();
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
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Link href="/careers" className="text-sm text-brand-600 hover:underline mb-6 inline-block">
        ← Back to careers
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
        <p className="text-gray-500 text-sm mb-1">{job.company}</p>
        <p className="text-brand-600 font-semibold text-sm mb-4">{job.salary}</p>
        <div className="flex gap-2 mb-6">
          <span className="text-xs font-medium bg-brand-50 text-brand-700 px-3 py-1 rounded-full">{job.type}</span>
          <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{job.vertical}</span>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {descriptions[job.id] ?? "Full job description available upon application."}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">Apply for this Position</h2>
        <ApplyForm jobId={job.id} jobTitle={job.title} />
      </div>
    </div>
  );
}
