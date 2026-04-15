import Link from "next/link";
import ApplyForm from "@/components/ApplyForm";

// Placeholder — will be replaced with Supabase fetch
const JOBS: Record<string, { title: string; company: string; location: string; type: string; description: string }> = {
  "1": { title: "Software Engineer", company: "Acme Corp", location: "London, UK", type: "Full-time", description: "We are looking for a skilled Software Engineer to join our team. You will build and maintain web applications using modern technologies." },
  "2": { title: "Product Manager", company: "Globex Inc", location: "Manchester, UK", type: "Full-time", description: "Lead product strategy and work closely with engineering and design teams to deliver outstanding products." },
  "3": { title: "UX Designer", company: "Initech", location: "Remote", type: "Contract", description: "Design intuitive and engaging user experiences for our suite of digital products." },
  "4": { title: "Data Analyst", company: "Umbrella Ltd", location: "Birmingham, UK", type: "Part-time", description: "Analyse large datasets and present insights to help drive business decisions." },
};

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = JOBS[id];

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Job not found</h1>
        <Link href="/jobs" className="text-brand-600 hover:underline">Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Link href="/jobs" className="text-sm text-brand-600 hover:underline mb-6 inline-block">
        ← Back to jobs
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-500">{job.company} · {job.location}</p>
          </div>
          <span className="text-sm font-medium bg-brand-50 text-brand-700 px-3 py-1 rounded-full">
            {job.type}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">Apply for this position</h2>
        <ApplyForm jobId={id} jobTitle={job.title} />
      </div>
    </div>
  );
}
