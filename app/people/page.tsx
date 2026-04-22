import Image from 'next/image';
import { readPeople } from '@/lib/contentData';

const areaColors: Record<string, string> = {
  'All Verticals':       'bg-brand-100 text-brand-700',
  'IT & Software':       'bg-blue-100 text-blue-700',
  'Data Center':         'bg-slate-100 text-slate-700',
  'Pharmaceutical':      'bg-emerald-100 text-emerald-700',
  'Candidate Relations': 'bg-purple-100 text-purple-700',
  'Operations':          'bg-amber-100 text-amber-700',
};

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=1d4ed8&color=fff&bold=true`;
}

export default function PeoplePage() {
  const team = readPeople().filter(p => p.active).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-brand-900 text-white py-20 px-6">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3">Our Team</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">The People Behind the Placements</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Every great hire starts with a great recruiter. Meet the team that makes it happen.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {team.map(person => (
            <div key={person.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex gap-5 items-start hover:border-brand-300 hover:shadow-md transition group">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                <Image
                  src={person.imageUrl || avatarUrl(person.name)}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-700 transition">{person.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{person.title}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${areaColors[person.area] ?? 'bg-gray-100 text-gray-700'}`}>
                    {person.area}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mt-2">{person.bio}</p>
                {person.linkedin && (
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-brand-600 hover:underline">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-brand-900 text-white rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-8">Collectively, Our Team Has:</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { value: '500+', label: 'Professionals Placed' },
              { value: '20+',  label: 'Years of Combined Leadership' },
              { value: '3',    label: 'Industry Verticals Mastered' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-extrabold">{s.value}</p>
                <p className="text-blue-200 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
