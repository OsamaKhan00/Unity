const pillars = [
  {
    title: "People Over Process",
    desc:  "We don't hide behind automated workflows. Every candidate and every client speaks to a real person who is invested in the outcome. Recruitment is a human endeavor — and we treat it that way.",
  },
  {
    title: "Radical Transparency",
    desc:  "We tell our clients what we're finding in the market, even when it's not what they want to hear. We tell candidates the full picture of a role, including its challenges. Honest conversations lead to better placements.",
  },
  {
    title: "Deep Specialization",
    desc:  "We recruit in three industries because we know them well enough to be genuinely useful. We've turned away business outside our verticals — because doing something wrong doesn't serve anyone.",
  },
  {
    title: "Continuous Learning",
    desc:  "Our team regularly attends industry conferences, completes certifications, and stays close to the technical communities we serve. If a technology or regulation changes, we need to know before our clients do.",
  },
  {
    title: "Inclusive by Design",
    desc:  "We actively work to surface candidates from underrepresented groups. Diverse teams build better products, run safer facilities, and make stronger companies. Inclusion isn't a checkbox — it's a better outcome.",
  },
  {
    title: "Long-Term Relationships",
    desc:  "We measure ourselves by placements that last. A hire that doesn't stick isn't a success. We stay in contact after placements close, because relationships — not transactions — are what built this company.",
  },
];

const environment = [
  { label: "Remote-Friendly",        detail: "Our team works with a flexible, results-driven schedule." },
  { label: "Collaborative",          detail: "Every recruiter has visibility across verticals to share leads and insights." },
  { label: "Feedback-Driven",        detail: "We run regular retrospectives and actively seek input from the team." },
  { label: "Growth-Oriented",        detail: "Career development and continuous learning are built into our model." },
];

export default function CulturePage() {
  return (
    <div className="max-w-5xl mx-auto py-14 px-6">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Our Culture</p>
        <h1 className="text-4xl font-bold mb-4">How We Work — and Why It Matters</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Culture isn't a mission statement on the wall. It's how we make decisions when no one's watching,
          how we treat people when it's inconvenient, and what we refuse to compromise on.
        </p>
      </div>

      {/* Culture pillars */}
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {pillars.map((p) => (
          <div key={p.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-brand-700 text-lg mb-2">{p.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Environment */}
      <div className="bg-brand-900 text-white rounded-2xl p-10 mb-14">
        <h2 className="text-2xl font-bold text-center mb-8">Our Work Environment</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {environment.map((e) => (
            <div key={e.label} className="flex gap-4 items-start">
              <span className="text-blue-300 text-lg mt-0.5">✓</span>
              <div>
                <p className="font-semibold">{e.label}</p>
                <p className="text-blue-200 text-sm">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder note */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-4">A Word From Our Founder</p>
        <blockquote className="text-gray-700 leading-relaxed text-lg italic mb-4">
          "I've spent over two decades watching what happens when the right person is placed in the right environment —
          and what happens when they aren't. The difference is enormous. Everything we do at Apex is about
          getting that right. Not most of the time. Every time."
        </blockquote>
        <p className="text-sm font-semibold text-gray-900">— Naeem Malik, Founder & Managing Director</p>
      </div>
    </div>
  );
}
