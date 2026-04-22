'use client';
import { useState, useEffect } from 'react';

interface SiteContent {
  hero_headline: string; hero_subheading: string; hero_badge: string;
  mission_statement: string; about_tagline: string; about_intro: string;
  cta_headline: string; cta_subheading: string;
  stats: Array<{value:string;label:string}>;
  why_us: Array<{title:string;desc:string}>;
  values: Array<{title:string;desc:string}>;
}

type Section = 'hero' | 'mission' | 'stats' | 'why_us' | 'cta' | 'values';

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [section, setSection] = useState<Section>('hero');

  useEffect(() => {
    fetch('/api/admin/content').then(r=>r.json()).then(data=>{ setContent(data); setLoading(false); });
  }, []);

  async function save() {
    if (!content) return;
    setSaving(true); setSaved(false);
    await fetch('/api/admin/content', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(content) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function update(key: keyof SiteContent, value: unknown) {
    setContent(c => c ? ({ ...c, [key]: value }) : c);
  }

  function updateStat(i: number, k: 'value'|'label', v: string) {
    if (!content) return;
    const stats = [...content.stats];
    stats[i] = { ...stats[i], [k]: v };
    update('stats', stats);
  }

  function updateWhyUs(i: number, k: 'title'|'desc', v: string) {
    if (!content) return;
    const why_us = [...content.why_us];
    why_us[i] = { ...why_us[i], [k]: v };
    update('why_us', why_us);
  }

  function updateValue(i: number, k: 'title'|'desc', v: string) {
    if (!content) return;
    const values = [...content.values];
    values[i] = { ...values[i], [k]: v };
    update('values', values);
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  const tabs: {id: Section; label: string}[] = [
    { id:'hero', label:'Hero' },
    { id:'mission', label:'Mission & About' },
    { id:'stats', label:'Stats' },
    { id:'why_us', label:'Why Us' },
    { id:'cta', label:'CTA Banner' },
    { id:'values', label:'Values' },
  ];

  if (loading || !content) return <div className="p-6 text-sm text-gray-400">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Site Content</h1>
          <p className="text-sm text-gray-500 mt-0.5">Edit the copy shown across the public website</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${saved ? 'bg-green-600 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'} disabled:opacity-50`}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSection(t.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${section === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">

        {section === 'hero' && (
          <>
            <div>
              <label className={labelCls}>Badge text</label>
              <input type="text" value={content.hero_badge} onChange={e=>update('hero_badge',e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Headline</label>
              <textarea rows={2} value={content.hero_headline} onChange={e=>update('hero_headline',e.target.value)} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Subheading</label>
              <textarea rows={3} value={content.hero_subheading} onChange={e=>update('hero_subheading',e.target.value)} className={`${inputCls} resize-none`} />
            </div>
          </>
        )}

        {section === 'mission' && (
          <>
            <div>
              <label className={labelCls}>Mission Statement</label>
              <textarea rows={3} value={content.mission_statement} onChange={e=>update('mission_statement',e.target.value)} className={`${inputCls} resize-none`} />
              <p className="text-xs text-gray-400 mt-1">Displayed in quotes on the homepage and About page</p>
            </div>
            <div>
              <label className={labelCls}>About Page Tagline</label>
              <input type="text" value={content.about_tagline} onChange={e=>update('about_tagline',e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>About Page Introduction</label>
              <textarea rows={3} value={content.about_intro} onChange={e=>update('about_intro',e.target.value)} className={`${inputCls} resize-none`} />
            </div>
          </>
        )}

        {section === 'stats' && (
          <div className="space-y-4">
            {content.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className={labelCls}>Value (e.g. 500+)</label>
                  <input type="text" value={s.value} onChange={e=>updateStat(i,'value',e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Label</label>
                  <input type="text" value={s.label} onChange={e=>updateStat(i,'label',e.target.value)} className={inputCls} />
                </div>
              </div>
            ))}
          </div>
        )}

        {section === 'why_us' && (
          <div className="space-y-4">
            {content.why_us.map((w, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div>
                  <label className={labelCls}>Title</label>
                  <input type="text" value={w.title} onChange={e=>updateWhyUs(i,'title',e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea rows={2} value={w.desc} onChange={e=>updateWhyUs(i,'desc',e.target.value)} className={`${inputCls} resize-none`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {section === 'cta' && (
          <>
            <div>
              <label className={labelCls}>CTA Headline</label>
              <textarea rows={2} value={content.cta_headline} onChange={e=>update('cta_headline',e.target.value)} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>CTA Subheading</label>
              <textarea rows={2} value={content.cta_subheading} onChange={e=>update('cta_subheading',e.target.value)} className={`${inputCls} resize-none`} />
            </div>
          </>
        )}

        {section === 'values' && (
          <div className="space-y-4">
            {content.values.map((v, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div>
                  <label className={labelCls}>Value Title</label>
                  <input type="text" value={v.title} onChange={e=>updateValue(i,'title',e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea rows={2} value={v.desc} onChange={e=>updateValue(i,'desc',e.target.value)} className={`${inputCls} resize-none`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
