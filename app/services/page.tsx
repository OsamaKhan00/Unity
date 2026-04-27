import Link from "next/link";

const services = [
  {
    id: "it",
    title: "IT Solutions, Software & DevOps",
    description:
      "Technology moves fast. The companies that stay ahead are the ones with the right engineers in place. Apex Talent Group has spent years building a network of elite software developers, cloud architects, and DevOps professionals across the Pacific Northwest and beyond. We work with startups scaling their first engineering teams and enterprises modernizing legacy systems — and we know the difference between a candidate who can interview and one who can actually deliver.",
    positions: [
      { title: "Software Engineer",               note: "Full Stack, Backend, Frontend"             },
      { title: "DevOps Engineer",                  note: "CI/CD, Infrastructure as Code"             },
      { title: "Site Reliability Engineer (SRE)",  note: "Observability, Incident Response"          },
      { title: "Cloud Architect",                  note: "AWS, Azure, GCP"                           },
      { title: "Data Engineer",                    note: "Pipelines, Warehousing, ETL"               },
      { title: "Machine Learning Engineer",        note: "Model Development, MLOps"                  },
      { title: "Cybersecurity Analyst",            note: "SOC, Penetration Testing, Compliance"      },
      { title: "QA / Automation Engineer",         note: "Test Frameworks, Selenium, Cypress"        },
      { title: "Technical Program Manager",        note: "Agile, Cross-functional Delivery"          },
    ],
  },
  {
    id: "datacenter",
    title: "Data Center Commissioning",
    description:
      "The world runs on data centers — and data centers run on precision. From hyperscale cloud facilities to colocation campuses, we place the critical infrastructure professionals who commission, operate, and maintain these environments. Our network includes engineers with hands-on experience at tier III and IV facilities, and we understand the urgency and technical rigor that critical infrastructure demands.",
    positions: [
      { title: "Commissioning Engineer (Cx)",       note: "Electrical, Mechanical Systems"            },
      { title: "MEP Project Manager",               note: "Mechanical, Electrical, Plumbing"          },
      { title: "Critical Facilities Engineer",       note: "Operations & Maintenance"                 },
      { title: "BMS / DCIM Specialist",             note: "Building Management Systems"               },
      { title: "Electrical Engineer",               note: "Power Distribution, UPS, Generators"       },
      { title: "HVAC / Cooling Systems Engineer",   note: "CRAC, Chiller, Economization"              },
      { title: "Structured Cabling Technician",     note: "Fiber, Copper, Patch Panel"                },
      { title: "Data Center Operations Manager",    note: "Shift Leadership, SLA Management"          },
      { title: "Facilities Project Coordinator",    note: "Scheduling, Vendor Management"             },
    ],
  },
  {
    id: "pharma",
    title: "Pharmaceutical Facilities Commissioning",
    description:
      "Pharmaceutical facilities demand the highest standards of compliance, precision, and documentation. We recruit specialists who understand GMP environments, regulatory frameworks, and the lifecycle of a facility from design through validation. Whether you're building a new sterile manufacturing suite or validating an existing fill-finish line, our team has the network to find the experts you need.",
    positions: [
      { title: "C&Q Engineer",                     note: "Commissioning & Qualification"             },
      { title: "Validation Engineer",              note: "IQ, OQ, PQ Protocols"                      },
      { title: "Process Engineer",                 note: "Manufacturing Processes, Scale-Up"          },
      { title: "Clean Room Specialist",            note: "ISO Classification, Environmental Monitoring" },
      { title: "Automation / SCADA Engineer",      note: "PLC, DCS, 21 CFR Part 11"                  },
      { title: "GMP Compliance Specialist",        note: "SOPs, Deviation Management, Audits"        },
      { title: "Quality Assurance Manager",        note: "QMS, Risk Management, Regulatory Affairs"  },
      { title: "Regulatory Affairs Specialist",    note: "FDA, EMA, cGMP Submissions"                },
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-brand-900 text-white py-20 px-6">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3">What We Offer</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Our Services</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            We specialize in three high-demand, technically complex verticals. This focus lets us
            go deeper — not broader — so every candidate we present is genuinely qualified.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-14 px-6">
        <div className="space-y-14">
          {services.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-20">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-brand-900 px-8 py-6">
                  <h2 className="text-xl font-bold text-white">{s.title}</h2>
                </div>
                <div className="px-8 py-7">
                  <p className="text-gray-600 leading-relaxed mb-7">{s.description}</p>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Positions We Recruit For
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {s.positions.map((p) => (
                      <div key={p.title} className="flex items-start gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                        <span className="text-brand-600 mt-0.5 text-xs">●</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-brand-600 text-white rounded-2xl p-10 text-center">
          <h2 className="text-xl font-bold mb-2">Looking to hire in one of these areas?</h2>
          <p className="text-blue-100 mb-6">Tell us what you need and we'll get to work.</p>
          <Link
            href="/contact"
            className="bg-white text-brand-700 font-semibold px-7 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
