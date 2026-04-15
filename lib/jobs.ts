export const jobs = [
  // IT & Software
  { id: "1",  title: "Senior Software Engineer (Full Stack)",   company: "Confidential — Seattle, WA",   type: "Full-time",  vertical: "IT & Software",  salary: "$130K–$170K" },
  { id: "2",  title: "DevOps Engineer",                         company: "Confidential — Remote",         type: "Full-time",  vertical: "IT & Software",  salary: "$115K–$145K" },
  { id: "3",  title: "Cloud Architect (AWS)",                   company: "Confidential — Seattle, WA",   type: "Full-time",  vertical: "IT & Software",  salary: "$145K–$185K" },
  { id: "4",  title: "Site Reliability Engineer (SRE)",         company: "Confidential — Hybrid",         type: "Contract",   vertical: "IT & Software",  salary: "$90–$110/hr"  },
  { id: "5",  title: "Cybersecurity Analyst",                   company: "Confidential — Remote",         type: "Full-time",  vertical: "IT & Software",  salary: "$100K–$130K" },
  // Data Center
  { id: "6",  title: "Commissioning Engineer (Cx)",             company: "Confidential — Quincy, WA",    type: "Contract",   vertical: "Data Center",    salary: "$80–$100/hr"  },
  { id: "7",  title: "MEP Project Manager",                     company: "Confidential — Seattle, WA",   type: "Full-time",  vertical: "Data Center",    salary: "$120K–$155K" },
  { id: "8",  title: "Critical Facilities Engineer",            company: "Confidential — Spokane, WA",   type: "Full-time",  vertical: "Data Center",    salary: "$95K–$125K"  },
  { id: "9",  title: "BMS / DCIM Specialist",                   company: "Confidential — Remote/Travel", type: "Contract",   vertical: "Data Center",    salary: "$75–$95/hr"   },
  // Pharma
  { id: "10", title: "C&Q Engineer",                            company: "Confidential — Bothell, WA",   type: "Contract",   vertical: "Pharmaceutical", salary: "$85–$105/hr"  },
  { id: "11", title: "Validation Engineer",                     company: "Confidential — Seattle, WA",   type: "Full-time",  vertical: "Pharmaceutical", salary: "$100K–$130K" },
  { id: "12", title: "GMP Compliance Specialist",               company: "Confidential — Hybrid",         type: "Full-time",  vertical: "Pharmaceutical", salary: "$90K–$115K"  },
];

export const jobDescriptions: Record<string, string> = {
  "1":  "We are seeking a Senior Full Stack Engineer to join a fast-growing technology company in the Seattle area. You will architect and build scalable web applications, mentor junior engineers, and contribute to technical roadmap decisions. Strong experience with React, Node.js, and cloud infrastructure is essential.",
  "2":  "An established technology firm is looking for a DevOps Engineer to improve and maintain their CI/CD pipelines, infrastructure-as-code practices, and cloud deployments. Experience with Terraform, Kubernetes, and AWS or Azure required.",
  "3":  "A Seattle-based enterprise is seeking a Cloud Architect to lead the design and implementation of their multi-cloud strategy. You will work with senior stakeholders to align architecture decisions with business objectives. Deep AWS expertise required; GCP or Azure a plus.",
  "4":  "We are placing an SRE on a contract basis with a leading technology firm undergoing rapid growth. You will own reliability, observability, and incident response for critical production systems. Experience with Prometheus, Grafana, and PagerDuty preferred.",
  "5":  "A growing technology company seeks a Cybersecurity Analyst to own their security monitoring, incident response, and compliance posture. Experience with SIEM tools, vulnerability management, and frameworks such as NIST or SOC 2 preferred.",
  "6":  "A major data center construction project in Quincy, WA is seeking an experienced Commissioning Engineer. You will oversee the Cx process for electrical and mechanical systems in a hyperscale environment. LEED or CxA certification preferred.",
  "7":  "A leading data center developer is seeking an MEP Project Manager to manage mechanical, electrical, and plumbing scopes across a major campus expansion. PMP certification and critical infrastructure experience required.",
  "8":  "A colocation provider in Spokane is hiring a Critical Facilities Engineer to manage day-to-day operations, preventative maintenance, and incident response for their data center campus. Experience in a Tier III+ environment required.",
  "9":  "We are placing a BMS / DCIM Specialist with a national data center operator. You will be responsible for configuring, maintaining, and improving building management and data center infrastructure management systems across multiple sites.",
  "10": "A pharmaceutical company in Bothell is seeking a C&Q Engineer for a new biopharmaceutical manufacturing facility. You will develop and execute commissioning and qualification protocols across utilities and process equipment in a GMP environment.",
  "11": "A Seattle-area biotech is hiring a Validation Engineer to support IQ, OQ, and PQ activities for a new fill-finish line. Experience in a regulated pharma environment and familiarity with FDA guidance documents required.",
  "12": "A pharmaceutical manufacturer is seeking a GMP Compliance Specialist to support SOP development, deviation management, and internal audit programs. Strong knowledge of FDA regulations and 21 CFR Part 211 required.",
};
