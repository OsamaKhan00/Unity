const recruiters = [
  {
    name:  "Naeem Malik",
    title: "Founder & Managing Director",
    bio:   "With over 20 years of experience in technical staffing and workforce solutions, Naeem has built his career — and his reputation — in one of the most competitive talent markets in the world: the Seattle metropolitan area. Having developed vendor relationships with Microsoft, Amazon, and Expedia, he brings unmatched insight into what the best companies actually need from their people. Over his career, Naeem has opened doors for hundreds of talented professionals, ensuring that ambition is never blocked by a lack of opportunity.",
  },
  {
    name:  "Sarah Chen",
    title: "Senior Technical Recruiter — IT & Software",
    bio:   "Sarah specializes in placing software engineers, cloud architects, and DevOps professionals at high-growth technology companies. With a background in computer science, she bridges the gap between technical requirements and human potential.",
  },
  {
    name:  "Marcus Williams",
    title: "Lead Recruiter — Data Center & Infrastructure",
    bio:   "Marcus brings a decade of experience in critical infrastructure staffing. From commissioning engineers to MEP project managers, he has an instinct for finding the specialists that data center projects depend on.",
  },
  {
    name:  "Priya Kapoor",
    title: "Pharmaceutical & Life Sciences Specialist",
    bio:   "Priya's expertise lies at the intersection of regulatory compliance and talent. She places C&Q engineers, validation specialists, and GMP professionals with pharmaceutical and biotech firms across the country.",
  },
  {
    name:  "Jordan Hayes",
    title: "Talent Acquisition Partner",
    bio:   "Jordan manages candidate relationships from first contact through successful placement. Known for a personable approach and sharp eye for cultural fit, Jordan ensures that every hire is the right hire — for both sides.",
  },
];

const values = [
  { title: "Integrity",        desc: "We are transparent with every client and every candidate. No smoke, no mirrors." },
  { title: "Precision",        desc: "We recruit for specific industries because depth of knowledge produces better outcomes than breadth." },
  { title: "People First",     desc: "Behind every job title is a person with goals, a family, and a future. We never lose sight of that." },
  { title: "Long-Term Focus",  desc: "We measure success not by placements made, but by placements that last." },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-14 px-6">

      {/* Intro */}
      <div className="text-center mb-14">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">About Us</p>
        <h1 className="text-4xl font-bold mb-4">Built on Experience. Driven by People.</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Apex Talent Group was founded with a single belief: the right person in the right role
          changes everything — for the individual, the team, and the company.
        </p>
      </div>

      {/* Who we are / What we do / How we approach it */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {[
          {
            heading: "Who We Are",
            body: "We are a Seattle-based specialized recruitment firm with deep roots in the technology, critical infrastructure, and pharmaceutical sectors. Our team combines industry-specific knowledge with genuine care for the people we place and the companies we serve.",
          },
          {
            heading: "What We Do",
            body: "We recruit specialized talent for roles that demand more than a keyword match — IT engineering, data center commissioning, and pharmaceutical facilities. We handle the entire process: sourcing, vetting, interviewing, and placement.",
          },
          {
            heading: "How We Do It",
            body: "We take a consultative approach. We spend time understanding a client's culture, team dynamics, and technical requirements before we ever submit a candidate. Quality over quantity — every time.",
          },
        ].map((item) => (
          <div key={item.heading} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-brand-700 mb-2">{item.heading}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <div className="bg-brand-900 text-white rounded-2xl p-10 text-center mb-16">
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-4">Our Mission</p>
        <blockquote className="text-xl md:text-2xl font-semibold leading-snug max-w-3xl mx-auto">
          "To bridge the gap between exceptional talent and industry-leading organizations —
          delivering precision recruitment that drives innovation, growth, and lasting impact."
        </blockquote>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-7 text-center">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v) => (
            <div key={v.title} className="bg-gray-50 rounded-xl border border-gray-100 p-6 flex gap-4">
              <div className="w-2 bg-brand-600 rounded-full shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{v.title}</h4>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold mb-2 text-center">Meet the Team</h2>
        <p className="text-gray-500 text-center mb-8">The people behind every successful placement.</p>
        <div className="space-y-5">
          {recruiters.map((r) => (
            <div key={r.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex gap-5 items-start">
              <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl shrink-0">
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{r.name}</h3>
                <p className="text-xs text-brand-600 font-medium mb-2">{r.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{r.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
