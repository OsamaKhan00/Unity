const projects = [
  {
    title:    "Hyperscale Data Center Staffing — Pacific Northwest",
    client:   "Confidential Cloud Provider",
    vertical: "Data Center",
    outcome:  "Sourced and placed a 35-person commissioning team — including Cx engineers, MEP specialists, and BMS technicians — within a 6-week window for a 200MW facility build-out. Zero critical delays attributable to staffing.",
    year:     "2024",
  },
  {
    title:    "Enterprise Engineering Team Expansion",
    client:   "Seattle-Based Technology Company",
    vertical: "IT & Software",
    outcome:  "Partnered with a rapidly scaling SaaS company to fill 22 engineering roles across backend, DevOps, and cloud architecture in under 90 days. Retention rate at 12 months: 91%.",
    year:     "2024",
  },
  {
    title:    "GMP Facility Commissioning — Biotech Startup",
    client:   "Confidential Pharmaceutical Client",
    vertical: "Pharmaceutical",
    outcome:  "Assembled a complete C&Q and validation team for a new sterile manufacturing facility. All IQ/OQ/PQ phases completed on schedule, with zero FDA observations attributable to personnel gaps.",
    year:     "2023",
  },
  {
    title:    "DevOps Transformation — Financial Services Firm",
    client:   "Pacific Northwest Financial Services",
    vertical: "IT & Software",
    outcome:  "Placed a four-person DevOps team — including a lead SRE — to drive a cloud migration initiative. Infrastructure deployment time reduced by 70% within six months of team onboarding.",
    year:     "2023",
  },
  {
    title:    "Multi-Site Data Center Technician Rollout",
    client:   "National Colocation Provider",
    vertical: "Data Center",
    outcome:  "Staffed critical facilities technicians across five regional sites simultaneously, maintaining SLA compliance throughout a 12-month expansion program.",
    year:     "2022",
  },
  {
    title:    "Pharma Automation Specialist Placement",
    client:   "Confidential Life Sciences Client",
    vertical: "Pharmaceutical",
    outcome:  "Identified and placed a SCADA/DCS automation engineer with direct 21 CFR Part 11 experience — a profile with fewer than 200 qualified candidates nationally. Placement completed in 3 weeks.",
    year:     "2022",
  },
];

const verticalColors: Record<string, string> = {
  "Data Center":    "bg-slate-100 text-slate-700",
  "IT & Software":  "bg-blue-100 text-blue-700",
  "Pharmaceutical": "bg-emerald-100 text-emerald-700",
};

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto py-14 px-6">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Track Record</p>
        <h1 className="text-4xl font-bold mb-4">Projects & Engagements</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          A selection of notable recruitment engagements that demonstrate our capabilities across
          all three of our core verticals. Client details are kept confidential where requested.
        </p>
      </div>

      <div className="space-y-5">
        {projects.map((p) => (
          <div key={p.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">{p.title}</h2>
                <p className="text-sm text-gray-400">{p.client} · {p.year}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${verticalColors[p.vertical]}`}>
                {p.vertical}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{p.outcome}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Interested in what we can deliver for your organization?{" "}
          <a href="/contact" className="text-brand-600 font-medium hover:underline">
            Get in touch
          </a>{" "}
          and let's talk through your needs.
        </p>
      </div>
    </div>
  );
}
