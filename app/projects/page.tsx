import Image from 'next/image';
import { readProjects } from '@/lib/contentData';

const verticalColors: Record<string, string> = {
  'Data Center':    'bg-slate-100 text-slate-700',
  'IT & Software':  'bg-blue-100 text-blue-700',
  'Pharmaceutical': 'bg-emerald-100 text-emerald-700',
};

const verticalAccent: Record<string, string> = {
  'Data Center':    'border-l-slate-400',
  'IT & Software':  'border-l-blue-400',
  'Pharmaceutical': 'border-l-emerald-400',
};

export default function ProjectsPage() {
  const projects = readProjects().filter(p => p.active);
  const featured = projects.filter(p => p.featured);
  const rest     = projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-brand-900 text-white py-20 px-6">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3">Track Record</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Projects &amp; Engagements</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            A selection of notable engagements that demonstrate our capabilities across all three verticals.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Featured (with image) */}
        {featured.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-6">Featured Engagements</h2>
            <div className="grid sm:grid-cols-3 gap-5 mb-14">
              {featured.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition group">
                  {p.imageUrl && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${verticalColors[p.vertical] ?? 'bg-gray-100 text-gray-700'}`}>
                        {p.vertical}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{p.client} · {p.year}</p>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{p.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* All projects list */}
        {rest.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-6">All Engagements</h2>
            <div className="space-y-4">
              {rest.map(p => (
                <div key={p.id} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${verticalAccent[p.vertical] ?? 'border-l-gray-300'} shadow-sm p-6 hover:shadow-md transition`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{p.title}</h3>
                      <p className="text-sm text-gray-400 mt-0.5">{p.client} · {p.year}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${verticalColors[p.vertical] ?? 'bg-gray-100 text-gray-700'}`}>
                      {p.vertical}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.outcome}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Interested in what we can deliver for your organisation?{' '}
            <a href="/contact" className="text-brand-600 font-semibold hover:underline">Get in touch</a>{' '}
            and let&apos;s talk through your needs.
          </p>
        </div>
      </div>
    </div>
  );
}
