import Link from "next/link";

// Placeholder data — will be replaced with Supabase data later
const JOBS = [
  { id: "1", title: "Software Engineer", company: "Acme Corp", location: "London, UK", type: "Full-time" },
  { id: "2", title: "Product Manager", company: "Globex Inc", location: "Manchester, UK", type: "Full-time" },
  { id: "3", title: "UX Designer", company: "Initech", location: "Remote", type: "Contract" },
  { id: "4", title: "Data Analyst", company: "Umbrella Ltd", location: "Birmingham, UK", type: "Part-time" },
];

export default function JobsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-2">Open Positions</h1>
      <p className="text-gray-500 mb-8">Browse our latest opportunities and apply today.</p>

      <div className="space-y-4">
        {JOBS.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-brand-500 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
              </div>
              <span className="text-xs font-medium bg-brand-50 text-brand-700 px-3 py-1 rounded-full whitespace-nowrap">
                {job.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
