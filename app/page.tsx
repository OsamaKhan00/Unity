export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase/admin';
import { SiteContent } from '@/lib/contentData';

const iconMap: Record<string, React.ReactNode> = {
  code: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  server: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v.75a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25v-.75M21.75 6.75v.75a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 7.5v-.75M21.75 11.25H2.25" />
    </svg>
  ),
  flask: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.208 3.352A24.3 24.3 0 0112 21a24.301 24.301 0 01-8.008-2.648 2.25 2.25 0 01.208-3.352m11.6 0H4.4" />
    </svg>
  ),
};

export default async function HomePage() {
  const { data } = await createAdminClient().from('site_content').select('data').eq('id', 1).single();
  const raw = (data?.data ?? {}) as Partial<SiteContent>;
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

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80"
          alt="Modern office"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/92 via-brand-900/85 to-brand-700/80" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-28 text-center">
          <span className="inline-flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {content.hero_badge}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-[1.1] tracking-tight">
            {content.hero_headline}
          </h1>
          <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            {content.hero_subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-lg">
              Browse Open Positions
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-brand-700 text-white py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 text-center">
          {content.stats.map((s, i) => (
            <div key={s.label} className={`px-6 py-4 ${i > 0 ? 'sm:border-l border-white/10' : ''}`}>
              <p className="text-4xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1.5 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-6">Our Mission</p>
          <div className="relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl text-brand-100 font-serif leading-none select-none pointer-events-none">&ldquo;</span>
            <blockquote className="relative text-xl sm:text-2xl font-semibold text-gray-800 leading-relaxed">
              {content.mission_statement}
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Specialisms</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {content.services.map((s) => (
              <Link key={s.title} href={s.href} className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:border-brand-400 hover:shadow-lg transition flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-100 transition">
                  {iconMap[s.icon] ?? iconMap.code}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-700 transition">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
                <span className="text-sm font-medium text-brand-600 inline-flex items-center gap-1 mt-auto">
                  Learn more
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industry spotlight images ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Industries</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Where We Work</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { label: 'IT & Software',  sub: '5 open roles', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', shade: 'from-blue-900/80' },
              { label: 'Data Center',    sub: '4 open roles', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80', shade: 'from-slate-900/80' },
              { label: 'Pharmaceutical', sub: '3 open roles', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80', shade: 'from-emerald-900/80' },
            ].map((item) => (
              <Link key={item.label} href="/careers" className="relative rounded-2xl overflow-hidden h-56 group block">
                <Image src={item.img} alt={item.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${item.shade} to-transparent`} />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-white font-bold text-lg leading-tight">{item.label}</p>
                  <p className="text-white/70 text-sm mt-0.5">{item.sub} →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Why Apex</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why Apex Talent Group?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {content.why_us.map((item, i) => (
              <div key={item.title} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-brand-700 text-white py-20 px-6">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{content.cta_headline}</h2>
          <p className="text-blue-200 mb-8 text-lg max-w-xl mx-auto">{content.cta_subheading}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers" className="bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition shadow">
              View Open Positions
            </Link>
            <Link href="/contact" className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
