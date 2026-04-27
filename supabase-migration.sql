-- Run this entire file in Supabase Dashboard → SQL Editor

-- ── Drop existing tables (clean slate) ────────────────────────────────────────

DROP TABLE IF EXISTS admin_users    CASCADE;
DROP TABLE IF EXISTS site_content  CASCADE;
DROP TABLE IF EXISTS jobs          CASCADE;
DROP TABLE IF EXISTS projects      CASCADE;
DROP TABLE IF EXISTS people        CASCADE;
DROP TABLE IF EXISTS applications  CASCADE;

-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS people (
  id          TEXT    PRIMARY KEY,
  name        TEXT    NOT NULL DEFAULT '',
  title       TEXT    NOT NULL DEFAULT '',
  area        TEXT    NOT NULL DEFAULT '',
  bio         TEXT    NOT NULL DEFAULT '',
  image_url   TEXT    NOT NULL DEFAULT '',
  linkedin    TEXT    NOT NULL DEFAULT '',
  "order"     INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS projects (
  id          TEXT    PRIMARY KEY,
  title       TEXT    NOT NULL DEFAULT '',
  client      TEXT    NOT NULL DEFAULT '',
  vertical    TEXT    NOT NULL DEFAULT '',
  outcome     TEXT    NOT NULL DEFAULT '',
  year        TEXT    NOT NULL DEFAULT '',
  image_url   TEXT    NOT NULL DEFAULT '',
  featured    BOOLEAN NOT NULL DEFAULT false,
  active      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS jobs (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL DEFAULT '',
  company        TEXT NOT NULL DEFAULT '',
  location       TEXT NOT NULL DEFAULT '',
  type           TEXT NOT NULL DEFAULT 'Full-time',
  vertical       TEXT NOT NULL DEFAULT 'IT & Software',
  salary         TEXT NOT NULL DEFAULT '',
  description    TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'active',
  recruiter_id   TEXT NOT NULL DEFAULT '',
  recruiter_name TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS site_content (
  id   INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB   NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS admin_users (
  id            TEXT        PRIMARY KEY,
  email         TEXT        UNIQUE NOT NULL,
  name          TEXT        NOT NULL DEFAULT '',
  role          TEXT        NOT NULL DEFAULT 'editor',
  password_hash TEXT        NOT NULL DEFAULT '',
  active        BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id             TEXT        PRIMARY KEY,
  job_id         TEXT        NOT NULL,
  job_title      TEXT        NOT NULL DEFAULT '',
  first_name     TEXT        NOT NULL DEFAULT '',
  last_name      TEXT        NOT NULL DEFAULT '',
  email          TEXT        NOT NULL DEFAULT '',
  phone          TEXT        NOT NULL DEFAULT '',
  cover_letter   TEXT        NOT NULL DEFAULT '',
  cv_url         TEXT        NOT NULL DEFAULT '',
  status         TEXT        NOT NULL DEFAULT 'new',
  recruiter_id   TEXT        NOT NULL DEFAULT '',
  recruiter_name TEXT        NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ─────────────────────────────────────────────────────────

ALTER TABLE people        ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content  ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications  ENABLE ROW LEVEL SECURITY;

-- Public can read content tables; admin_users has no public policy
CREATE POLICY "public_read" ON people       FOR SELECT USING (true);
CREATE POLICY "public_read" ON projects     FOR SELECT USING (true);
CREATE POLICY "public_read" ON jobs         FOR SELECT USING (true);
CREATE POLICY "public_read" ON site_content FOR SELECT USING (true);

-- Anyone can submit an application; reads are service-role only
CREATE POLICY "public_insert" ON applications FOR INSERT WITH CHECK (true);

-- ── Seed: people ───────────────────────────────────────────────────────────────

INSERT INTO people (id, name, title, area, bio, image_url, linkedin, "order", active) VALUES
('1','Naeem Malik','Founder & Managing Director','All Verticals','With over 20 years of experience in technical staffing and workforce solutions, Naeem has built his career — and his reputation — in one of the most competitive talent markets in the world: the Seattle metropolitan area. Having developed vendor relationships with Microsoft, Amazon, and Expedia, he brings unmatched insight into what the best companies actually need from their people. Over his career, Naeem has opened doors for hundreds of talented professionals, ensuring that ambition is never blocked by a lack of opportunity.','','',1,true),
('2','Sarah Khalil','Senior Technical Recruiter','IT & Software','Sarah specializes in placing software engineers, cloud architects, and DevOps professionals at high-growth technology companies. With a background in computer science, she bridges the gap between technical requirements and human potential. Placed 80+ engineers in the past four years alone.','','',2,true),
('3','Marcus Williams','Lead Recruiter — Infrastructure','Data Center','Marcus brings a decade of experience in critical infrastructure staffing. From commissioning engineers to MEP project managers, he has an instinct for finding the specialists that data center projects depend on. Built and staffed commissioning teams for three hyperscale data center projects in the Pacific Northwest.','','',3,true),
('4','Priya Kapoor','Pharma & Life Sciences Specialist','Pharmaceutical','Priya''s expertise lies at the intersection of regulatory compliance and talent. She places C&Q engineers, validation specialists, and GMP professionals with pharmaceutical and biotech firms across the country. Has supported validation teams on FDA-regulated facility launches.','','',4,true),
('5','Jordan Hayes','Talent Acquisition Partner','Candidate Relations','Jordan manages candidate relationships from first contact through successful placement. Known for a personable approach and sharp eye for cultural fit, Jordan ensures that every hire is the right hire — for both sides.','','',5,true),
('6','Emily Torres','Operations & Client Success','Operations','Emily keeps every engagement running smoothly — from contract compliance to client communication. She is the backbone of operational excellence at Apex, ensuring that both clients and candidates always have a point of contact they can rely on.','','',6,true)
ON CONFLICT (id) DO NOTHING;

-- ── Seed: projects ─────────────────────────────────────────────────────────────

INSERT INTO projects (id, title, client, vertical, outcome, year, image_url, featured, active) VALUES
('1','Hyperscale Data Center Staffing — Pacific Northwest','Confidential Cloud Provider','Data Center','Sourced and placed a 35-person commissioning team — including Cx engineers, MEP specialists, and BMS technicians — within a 6-week window for a 200MW facility build-out. Zero critical delays attributable to staffing.','2024','https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',true,true),
('2','Enterprise Engineering Team Expansion','Seattle-Based Technology Company','IT & Software','Partnered with a rapidly scaling SaaS company to fill 22 engineering roles across backend, DevOps, and cloud architecture in under 90 days. Retention rate at 12 months: 91%.','2024','https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',true,true),
('3','GMP Facility Commissioning — Biotech Startup','Confidential Pharmaceutical Client','Pharmaceutical','Assembled a complete C&Q and validation team for a new sterile manufacturing facility. All IQ/OQ/PQ phases completed on schedule, with zero FDA observations attributable to personnel gaps.','2023','https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',true,true),
('4','DevOps Transformation — Financial Services Firm','Pacific Northwest Financial Services','IT & Software','Placed a four-person DevOps team — including a lead SRE — to drive a cloud migration initiative. Infrastructure deployment time reduced by 70% within six months of team onboarding.','2023','https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',false,true),
('5','Multi-Site Data Center Technician Rollout','National Colocation Provider','Data Center','Staffed critical facilities technicians across five regional sites simultaneously, maintaining SLA compliance throughout a 12-month expansion program.','2022','https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',false,true),
('6','Pharma Automation Specialist Placement','Confidential Life Sciences Client','Pharmaceutical','Identified and placed a SCADA/DCS automation engineer with direct 21 CFR Part 11 experience — a profile with fewer than 200 qualified candidates nationally. Placement completed in 3 weeks.','2022','https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',false,true)
ON CONFLICT (id) DO NOTHING;

-- ── Seed: jobs ─────────────────────────────────────────────────────────────────

INSERT INTO jobs (id, title, company, type, vertical, salary, description) VALUES
('3','Cloud Architect (AWS)','Confidential — Seattle, WA','Full-time','IT & Software','$145K–$185K','A Seattle-based enterprise is seeking a Cloud Architect to lead the design and implementation of their multi-cloud strategy. You will work with senior stakeholders to align architecture decisions with business objectives. Deep AWS expertise required; GCP or Azure a plus.'),
('4','Site Reliability Engineer (SRE)','Confidential — Hybrid','Contract','IT & Software','$90–$110/hr','We are placing an SRE on a contract basis with a leading technology firm undergoing rapid growth. You will own reliability, observability, and incident response for critical production systems. Experience with Prometheus, Grafana, and PagerDuty preferred.'),
('5','Cybersecurity Analyst','Confidential — Remote','Full-time','IT & Software','$100K–$130K','A growing technology company seeks a Cybersecurity Analyst to own their security monitoring, incident response, and compliance posture. Experience with SIEM tools, vulnerability management, and frameworks such as NIST or SOC 2 preferred.'),
('6','Commissioning Engineer (Cx)','Confidential — Quincy, WA','Contract','Data Center','$80–$100/hr','A major data center construction project in Quincy, WA is seeking an experienced Commissioning Engineer. You will oversee the Cx process for electrical and mechanical systems in a hyperscale environment. LEED or CxA certification preferred.'),
('7','MEP Project Manager','Confidential — Seattle, WA','Full-time','Data Center','$120K–$155K','A leading data center developer is seeking an MEP Project Manager to manage mechanical, electrical, and plumbing scopes across a major campus expansion. PMP certification and critical infrastructure experience required.'),
('8','Critical Facilities Engineer','Confidential — Spokane, WA','Full-time','Data Center','$95K–$125K','A colocation provider in Spokane is hiring a Critical Facilities Engineer to manage day-to-day operations, preventative maintenance, and incident response for their data center campus. Experience in a Tier III+ environment required.'),
('9','BMS / DCIM Specialist','Confidential — Remote/Travel','Contract','Data Center','$75–$95/hr','We are placing a BMS / DCIM Specialist with a national data center operator. You will be responsible for configuring, maintaining, and improving building management and data center infrastructure management systems across multiple sites.'),
('10','C&Q Engineer','Confidential — Bothell, WA','Contract','Pharmaceutical','$85–$105/hr','A pharmaceutical company in Bothell is seeking a C&Q Engineer for a new biopharmaceutical manufacturing facility. You will develop and execute commissioning and qualification protocols across utilities and process equipment in a GMP environment.'),
('11','Validation Engineer','Confidential — Seattle, WA','Full-time','Pharmaceutical','$100K–$130K','A Seattle-area biotech is hiring a Validation Engineer to support IQ, OQ, and PQ activities for a new fill-finish line. Experience in a regulated pharma environment and familiarity with FDA guidance documents required.'),
('12','GMP Compliance Specialist','Confidential — Hybrid','Full-time','Pharmaceutical','$90K–$115K','A pharmaceutical manufacturer is seeking a GMP Compliance Specialist to support SOP development, deviation management, and internal audit programs. Strong knowledge of FDA regulations and 21 CFR Part 211 required.')
ON CONFLICT (id) DO NOTHING;

-- ── Seed: site_content ─────────────────────────────────────────────────────────

INSERT INTO site_content (id, data) VALUES (1, $json${
  "hero_headline": "Connecting Exceptional Talent with Industry-Leading Organizations",
  "hero_subheading": "Apex Talent Group specializes in precision recruitment across IT, Data Center, and Pharmaceutical industries — delivering the right people, every time.",
  "hero_badge": "Seattle-Based · Nationally Recognized",
  "mission_statement": "To bridge the gap between exceptional talent and industry-leading organizations — delivering precision recruitment that drives innovation, growth, and lasting impact.",
  "stats": [
    { "value": "20+",  "label": "Years of Industry Experience" },
    { "value": "500+", "label": "Successful Placements" },
    { "value": "3",    "label": "Core Industry Verticals" },
    { "value": "100+", "label": "Partner Companies" }
  ],
  "services": [
    { "title": "IT Solutions, Software & DevOps", "desc": "We source top-tier engineers, architects, and DevOps professionals for technology companies of all sizes.", "href": "/services#it", "icon": "code" },
    { "title": "Data Center Commissioning", "desc": "Specialized staffing for critical infrastructure — from MEP engineers to BMS specialists.", "href": "/services#datacenter", "icon": "server" },
    { "title": "Pharmaceutical Facilities", "desc": "GMP-compliant talent for C&Q, validation, and pharmaceutical facility build-outs.", "href": "/services#pharma", "icon": "flask" }
  ],
  "why_us": [
    { "title": "Deep Industry Roots", "desc": "With over 20 years in the Seattle market — including placements at Microsoft, Amazon, and Expedia — we know what great talent looks like." },
    { "title": "People-First Approach", "desc": "We take the time to understand both sides of every hire, ensuring long-term success for candidates and clients alike." },
    { "title": "Specialized Expertise", "desc": "We don't recruit for everything. We recruit for what we know — IT, critical infrastructure, and pharmaceutical commissioning." }
  ],
  "about_tagline": "Built on Experience. Driven by People.",
  "about_intro": "Apex Talent Group was founded with a single belief: the right person in the right role changes everything — for the individual, the team, and the company.",
  "cta_headline": "Ready to find your next great hire — or your next great role?",
  "cta_subheading": "Whether you're a company looking to build your team or a candidate ready for your next challenge, we're here to help.",
  "values": [
    { "title": "Integrity",       "desc": "We are transparent with every client and every candidate. No smoke, no mirrors." },
    { "title": "Precision",       "desc": "We recruit for specific industries because depth of knowledge produces better outcomes than breadth." },
    { "title": "People First",    "desc": "Behind every job title is a person with goals, a family, and a future. We never lose sight of that." },
    { "title": "Long-Term Focus", "desc": "We measure success not by placements made, but by placements that last." }
  ]
}$json$::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ── Seed: admin_users ──────────────────────────────────────────────────────────

INSERT INTO admin_users (id, email, name, role, password_hash, active, created_at) VALUES
('1776879825599','muhammadosamakhan19@gmail.com','Osama Khan','editor','32d03285db7d7992f5c02f323144c9a1fe6630c1b32b3aa194e621574a05b767',true,'2026-04-22T17:43:45.599Z')
ON CONFLICT (id) DO NOTHING;

-- ── Add recruiter columns to existing deployments (safe to run on existing DB) ──

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS recruiter_id   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS recruiter_name TEXT NOT NULL DEFAULT '';

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS recruiter_id   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS recruiter_name TEXT NOT NULL DEFAULT '';

-- ── Add status and location columns to existing deployments (safe to run on existing DB) ──

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS status   TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '';
