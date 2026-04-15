import Link from "next/link";
import { jobs } from "@/lib/jobs";

const verticalColors: Record<string, string> = {
  "IT & Software":  "bg-blue-100 text-blue-700",
  "Data Center":    "bg-slate-100 text-slate-700",
  "Pharmaceutical": "bg-emerald-100 text-emerald-700",
};

const typeColors: Record<string, string> = {
  "Full-time": "bg-brand-50 text-brand-700",
  "Contract":  "bg-amber-50 text-amber-700",
};

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto py-14 px-6">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Open Positions</p>
        <h1 className="text-4xl font-bold mb-4">Find Your Next Role</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          We recruit for some of the most in-demand roles across IT, data center, and pharmaceutical
          industries. Browse our current openings below.
        </p>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/careers/${job.id}`}
            className="block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-brand-500 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{job.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{job.salary}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${verticalColors[job.vertical]}`}>
                  {job.vertical}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[job.type]}`}>
                  {job.type}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-600 text-sm">
          Don't see a role that fits?{" "}
          <a href="/contact" className="text-brand-600 font-medium hover:underline">
            Send us your CV
          </a>{" "}
          and we'll reach out when something relevant opens up.
        </p>
      </div>
    </div>
  );
}
