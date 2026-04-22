export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase/admin';
import { SiteContent, personFromRow } from '@/lib/contentData';

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=1d4ed8&color=fff&bold=true`;
}

export default async function AboutPage() {
  const supabase = createAdminClient();
  const { data: contentRow } = await supabase.from('site_content').select('data').eq('id', 1).single();
  const raw = (contentRow?.data ?? {}) as Partial<SiteContent>;
  const content: SiteContent = {
    hero_headline: raw.hero_headline ?? '',
    hero_subheading: raw.hero_subheading ?? '',
    hero_badge: raw.hero_badge ?? '',
    mission_statement: raw.mission_statement ?? '',
    stats: raw.stats ?? [],
    services: raw.services ?? [],
    why_us: raw.why_us ?? [],
    about_tagline: raw.about_tagline ?? '',
    about_intro: raw.about_intro ?? '',
    cta_headline: raw.cta_headline ?? '',
    cta_subheading: raw.cta_subheading ?? '',
    values: raw.values ?? [],
  };
  const { data: rawTeam } = await supabase.from('people').select('*').order('order', { ascending: true });
  const team = (rawTeam ?? []).map(personFromRow).filter(p => p.active);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-brand-900 text-white py-20 px-6">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3">About Us</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{content.about_tagline}</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">{content.about_intro}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Who / What / How */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            { heading: 'Who We Are', body: 'We are a Seattle-based specialized recruitment firm with deep roots in the technology, critical infrastructure, and pharmaceutical sectors. Our team combines industry-specific knowledge with genuine care for the people we place and the companies we serve.' },
            { heading: 'What We Do', body: 'We recruit specialized talent for roles that demand more than a keyword match — IT engineering, data center commissioning, and pharmaceutical facilities. We handle the entire process: sourcing, vetting, interviewing, and placement.' },
            { heading: 'How We Do It', body: 'We take a consultative approach. We spend time understanding a client\'s culture, team dynamics, and technical requirements before we ever submit a candidate. Quality over quantity — every time.' },
          ].map(item => (
            <div key={item.heading} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-brand-700 mb-3">{item.heading}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-brand-900 text-white rounded-2xl p-10 text-center mb-16">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-4">Our Mission</p>
          <blockquote className="text-xl sm:text-2xl font-semibold leading-snug max-w-3xl mx-auto">
            &ldquo;{content.mission_statement}&rdquo;
          </blockquote>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-7 text-center text-gray-900">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {content.values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4">
                <div className="w-1.5 bg-brand-600 rounded-full shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{v.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Meet the Team</h2>
          <p className="text-gray-500 text-center text-sm mb-8">The people behind every successful placement.</p>
          <div className="space-y-4">
            {team.map(person => (
              <div key={person.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex gap-5 items-start">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={person.imageUrl || avatarUrl(person.name)}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{person.name}</h3>
                  <p className="text-xs text-brand-600 font-semibold mb-2">{person.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
