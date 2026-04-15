import Link from "next/link";

const stats = [
  { value: "20+",  label: "Years of Industry Experience" },
  { value: "500+", label: "Successful Placements"        },
  { value: "3",    label: "Core Industry Verticals"      },
  { value: "100+", label: "Partner Companies"            },
];

const services = [
  {
    title: "IT Solutions, Software & DevOps",
    desc:  "We source top-tier engineers, architects, and DevOps professionals for technology companies of all sizes.",
    href:  "/services#it",
  },
  {
    title: "Data Center Commissioning",
    desc:  "Specialized staffing for critical infrastructure — from MEP engineers to BMS specialists.",
    href:  "/services#datacenter",
  },
  {
    title: "Pharmaceutical Facilities Commissioning",
    desc:  "GMP-compliant talent for C&Q, validation, and pharmaceutical facility build-outs.",
    href:  "/services#pharma",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-900 text-white py-28 px-6 text-center">
        <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-4">
          Seattle-Based · Nationally Recognized
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
          Connecting Exceptional Talent with Industry-Leading Organizations
        </h1>
        <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10">
          Apex Talent Group specializes in precision recruitment across IT, Data Center, and
          Pharmaceutical industries — delivering the right people, every time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/careers"
            className="bg-white text-brand-700 font-semibold px-7 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Browse Open Positions
          </Link>
          <Link
            href="/about"
            className="border border-white text-white font-semibold px-7 py-3 rounded-lg hover:bg-white hover:text-brand-700 transition"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-700 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Our Mission</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
            "To bridge the gap between exceptional talent and industry-leading organizations —
            delivering placement solutions that drive innovation, growth, and lasting impact."
          </h2>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">What We Do</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-brand-500 hover:shadow-md transition group"
              >
                <h3 className="text-lg font-semibold text-brand-700 mb-2 group-hover:text-brand-900">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Why Apex Talent Group?</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { title: "Deep Industry Roots",     desc: "With over 20 years in the Seattle market — including placements at Microsoft, Amazon, and Expedia — we know what great talent looks like." },
              { title: "People-First Approach",   desc: "We take the time to understand both sides of every hire, ensuring long-term success for candidates and clients alike." },
              { title: "Specialized Expertise",   desc: "We don't recruit for everything. We recruit for what we know — IT, critical infrastructure, and pharmaceutical commissioning." },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-brand-700 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 text-white py-14 px-6 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to find your next great hire — or your next great role?</h2>
        <p className="text-blue-100 mb-7 max-w-xl mx-auto">
          Whether you're a company looking to build your team or a candidate ready for your next challenge, we're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/careers"  className="bg-white text-brand-700 font-semibold px-7 py-3 rounded-lg hover:bg-blue-50 transition">View Open Positions</Link>
          <Link href="/contact"  className="border border-white text-white font-semibold px-7 py-3 rounded-lg hover:bg-white hover:text-brand-700 transition">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
