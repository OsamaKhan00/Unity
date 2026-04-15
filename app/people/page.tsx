const team = [
  {
    name:   "Naeem Malik",
    title:  "Founder & Managing Director",
    impact: "Over 20 years of experience and hundreds of successful placements at companies including Microsoft, Amazon, and Expedia. The vision and foundation behind everything Apex Talent Group does.",
    area:   "All Verticals",
  },
  {
    name:   "Sarah Chen",
    title:  "Senior Technical Recruiter",
    impact: "Placed 80+ software engineers, cloud architects, and DevOps professionals in the past four years alone. Known for an instinct that goes beyond the résumé.",
    area:   "IT & Software",
  },
  {
    name:   "Marcus Williams",
    title:  "Lead Recruiter — Infrastructure",
    impact: "Built and staffed commissioning teams for three hyperscale data center projects in the Pacific Northwest. Trusted by critical infrastructure firms nationwide.",
    area:   "Data Center",
  },
  {
    name:   "Priya Kapoor",
    title:  "Pharma & Life Sciences Specialist",
    impact: "Specialized in GMP-compliant placements for pharmaceutical and biotech firms. Has supported validation teams on FDA-regulated facility launches.",
    area:   "Pharmaceutical",
  },
  {
    name:   "Jordan Hayes",
    title:  "Talent Acquisition Partner",
    impact: "Manages candidate experience from first outreach to first day on the job. Ensures that every hire is a confident, well-informed, and supported placement.",
    area:   "Candidate Relations",
  },
  {
    name:   "Emily Torres",
    title:  "Operations & Client Success",
    impact: "Keeps every engagement running smoothly — from contract compliance to client communication. The backbone of operational excellence at Apex.",
    area:   "Operations",
  },
];

const areaColors: Record<string, string> = {
  "All Verticals":     "bg-brand-100 text-brand-700",
  "IT & Software":     "bg-blue-100 text-blue-700",
  "Data Center":       "bg-slate-100 text-slate-700",
  "Pharmaceutical":    "bg-emerald-100 text-emerald-700",
  "Candidate Relations": "bg-purple-100 text-purple-700",
  "Operations":        "bg-amber-100 text-amber-700",
};

export default function PeoplePage() {
  return (
    <div className="max-w-5xl mx-auto py-14 px-6">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Our Team</p>
        <h1 className="text-4xl font-bold mb-4">The People Behind the Placements</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Every great hire starts with a great recruiter. Meet the team that makes it happen.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {team.map((p) => (
          <div key={p.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex gap-4 items-start">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl shrink-0">
              {p.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{p.title}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${areaColors[p.area]}`}>
                  {p.area}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{p.impact}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Impact section */}
      <div className="mt-16 bg-brand-900 text-white rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Collectively, Our Team Has:</h2>
        <div className="grid sm:grid-cols-3 gap-8 mt-6">
          {[
            { value: "500+", label: "Professionals Placed" },
            { value: "20+",  label: "Years of Combined Leadership" },
            { value: "3",    label: "Industry Verticals Mastered" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
