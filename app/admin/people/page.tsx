'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Person {
  id: string; name: string; title: string; area: string;
  bio: string; imageUrl: string; linkedin: string; order: number; active: boolean;
}

interface AppRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  job_id: string;
  status: string;
  created_at: string;
  cv_url: string;
}

interface RecruiterStat {
  id: string;
  name: string;
  email: string;
  role: string;
  total: number;
  new: number;
  reviewed: number;
  shortlisted: number;
  placed: number;
  rejected: number;
  applications: AppRow[];
}

const AREAS = ['All Verticals','IT & Software','Data Center','Pharmaceutical','Candidate Relations','Operations','Other'];

const defaultForm = { name:'', title:'', area:'IT & Software', bio:'', imageUrl:'', linkedin:'', order:0, active:true };

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-green-100 text-green-700',
  placed: 'bg-purple-100 text-purple-700',
  rejected: 'bg-red-100 text-red-700',
};

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=1d4ed8&color=fff&bold=true`;
}

export default function AdminPeoplePage() {
  const [activeTab, setActiveTab] = useState<'team' | 'recruiters'>('team');

  // ── Team tab state
  const [people, setPeople]     = useState<Person[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<Person | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]         = useState(defaultForm);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string|null>(null);

  // ── Recruiter tab state
  const [stats, setStats]             = useState<RecruiterStat[]>([]);
  const [unassigned, setUnassigned]   = useState<AppRow[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [expandedId, setExpandedId]   = useState<string|null>(null);

  useEffect(() => { fetchPeople(); }, []);

  async function fetchPeople() {
    const r = await fetch('/api/admin/people');
    if (r.ok) setPeople(await r.json());
    setLoading(false);
  }

  async function fetchStats() {
    if (stats.length > 0) return; // already loaded
    setStatsLoading(true);
    const r = await fetch('/api/admin/recruiter-stats');
    if (r.ok) {
      const json = await r.json();
      setStats(json.stats ?? []);
      setUnassigned(json.unassigned ?? []);
    }
    setStatsLoading(false);
  }

  function handleTabChange(tab: 'team' | 'recruiters') {
    setActiveTab(tab);
    if (tab === 'recruiters') fetchStats();
  }

  function openCreate() { setForm({ ...defaultForm, order: people.length + 1 }); setCreating(true); setEditing(null); }
  function openEdit(p: Person) { setForm({ name:p.name, title:p.title, area:p.area, bio:p.bio, imageUrl:p.imageUrl??'', linkedin:p.linkedin??'', order:p.order, active:p.active }); setEditing(p); setCreating(false); }
  function closeForm() { setEditing(null); setCreating(false); }
  function set(k: string, v: string|number|boolean) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/admin/people/${editing.id}` : '/api/admin/people';
    const method = editing ? 'PUT' : 'POST';
    const r = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    if (r.ok) { await fetchPeople(); closeForm(); }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}"?`)) return;
    setDeleting(id);
    await fetch(`/api/admin/people/${id}`, { method:'DELETE' });
    setPeople(p => p.filter(x => x.id !== id));
    setDeleting(null);
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">People</h1>
          <p className="text-sm text-gray-500 mt-0.5">Team members and recruiter activity</p>
        </div>
        {activeTab === 'team' && (
          <button onClick={openCreate} className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium">
            + Add Person
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        <button
          onClick={() => handleTabChange('team')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'team' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Team Members
        </button>
        <button
          onClick={() => handleTabChange('recruiters')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'recruiters' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Recruiter Activity
        </button>
      </div>

      {/* ── TEAM TAB ──────────────────────────────────────────────── */}
      {activeTab === 'team' && (
        <>
          {(creating || editing) && (
            <div className="bg-white rounded-xl border border-brand-200 shadow-sm p-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">{editing ? `Editing: ${editing.name}` : 'New Team Member'}</h2>
              <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                  <input required type="text" value={form.name} onChange={e=>set('name',e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Job Title *</label>
                  <input required type="text" value={form.title} onChange={e=>set('title',e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Area / Vertical</label>
                  <select value={form.area} onChange={e=>set('area',e.target.value)} className={inputCls}>
                    {AREAS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Photo URL</label>
                  <input type="url" value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} className={inputCls} placeholder="https://…" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn URL</label>
                  <input type="url" value={form.linkedin} onChange={e=>set('linkedin',e.target.value)} className={inputCls} placeholder="https://linkedin.com/in/…" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
                  <input type="number" value={form.order} onChange={e=>set('order',parseInt(e.target.value))} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bio *</label>
                  <textarea required rows={4} value={form.bio} onChange={e=>set('bio',e.target.value)} className={`${inputCls} resize-none`} />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e=>set('active',e.target.checked)} className="rounded text-brand-600" />
                    <span className="text-sm text-gray-700">Show on public site</span>
                  </label>
                </div>
                <div className="sm:col-span-2 flex gap-2">
                  <button type="submit" disabled={saving} className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition">
                    {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={closeForm} className="text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
            ) : people.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">No team members yet.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left hidden sm:table-cell">Area</th>
                    <th className="px-5 py-3 text-left hidden md:table-cell">Order</th>
                    <th className="px-5 py-3 text-left hidden md:table-cell">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {people.sort((a,b)=>a.order-b.order).map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                          <Image src={p.imageUrl||avatarUrl(p.name)} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.title}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 hidden sm:table-cell">{p.area}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">{p.order}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.active ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => openEdit(p)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                          <button onClick={() => handleDelete(p.id, p.name)} disabled={deleting===p.id} className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                            {deleting===p.id ? '…' : 'Remove'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── RECRUITER ACTIVITY TAB ────────────────────────────────── */}
      {activeTab === 'recruiters' && (
        <div className="space-y-4">
          {statsLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">Loading activity…</div>
          ) : stats.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">No recruiter data yet.</div>
          ) : (
            <>
              {stats.map(r => (
                <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Recruiter summary row */}
                  <div className="flex items-center gap-4 px-5 py-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.email} · <span className="capitalize">{r.role.replace('_', ' ')}</span></p>
                    </div>

                    {/* Stat pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatPill label="Total" value={r.total} color="bg-gray-100 text-gray-700" />
                      {r.shortlisted > 0 && <StatPill label="Shortlisted" value={r.shortlisted} color="bg-green-100 text-green-700" />}
                      {r.placed > 0 && <StatPill label="Placed" value={r.placed} color="bg-purple-100 text-purple-700" />}
                      {r.rejected > 0 && <StatPill label="Rejected" value={r.rejected} color="bg-red-100 text-red-700" />}
                    </div>

                    <button
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      className="text-xs text-brand-600 hover:underline shrink-0 font-medium"
                    >
                      {expandedId === r.id ? 'Hide' : `View ${r.total} application${r.total !== 1 ? 's' : ''}`}
                    </button>
                  </div>

                  {/* Expanded application list */}
                  {expandedId === r.id && (
                    <div className="border-t border-gray-100">
                      {r.applications.length === 0 ? (
                        <p className="text-sm text-gray-400 px-5 py-4 italic">No applications assigned yet.</p>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <tr>
                              <th className="px-5 py-2.5 text-left">Candidate</th>
                              <th className="px-5 py-2.5 text-left hidden sm:table-cell">Position</th>
                              <th className="px-5 py-2.5 text-left">Status</th>
                              <th className="px-5 py-2.5 text-left hidden md:table-cell">Date</th>
                              <th className="px-5 py-2.5 text-left">CV</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {r.applications.map(app => (
                              <tr key={app.id} className="hover:bg-gray-50 transition">
                                <td className="px-5 py-3">
                                  <p className="text-sm font-medium text-gray-900">{app.first_name} {app.last_name}</p>
                                  <p className="text-xs text-gray-500">{app.email}</p>
                                </td>
                                <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">{app.job_title}</td>
                                <td className="px-5 py-3">
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">
                                  {new Date(app.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-3">
                                  {app.cv_url ? (
                                    <a href={app.cv_url} target="_blank" rel="noopener noreferrer"
                                      className="text-xs text-brand-600 hover:underline">View</a>
                                  ) : (
                                    <span className="text-xs text-gray-300">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Unassigned */}
              {unassigned.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500">Unassigned</p>
                      <p className="text-xs text-gray-400">{unassigned.length} application{unassigned.length !== 1 ? 's' : ''} with no recruiter</p>
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === '__unassigned' ? null : '__unassigned')}
                      className="text-xs text-brand-600 hover:underline shrink-0 font-medium"
                    >
                      {expandedId === '__unassigned' ? 'Hide' : 'View'}
                    </button>
                  </div>
                  {expandedId === '__unassigned' && (
                    <div className="border-t border-gray-100">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-2.5 text-left">Candidate</th>
                            <th className="px-5 py-2.5 text-left hidden sm:table-cell">Position</th>
                            <th className="px-5 py-2.5 text-left">Status</th>
                            <th className="px-5 py-2.5 text-left hidden md:table-cell">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {unassigned.map(app => (
                            <tr key={app.id} className="hover:bg-gray-50 transition">
                              <td className="px-5 py-3">
                                <p className="text-sm font-medium text-gray-900">{app.first_name} {app.last_name}</p>
                                <p className="text-xs text-gray-500">{app.email}</p>
                              </td>
                              <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">{app.job_title}</td>
                              <td className="px-5 py-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">
                                {new Date(app.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${color}`}>
      <span className="font-bold">{value}</span> {label}
    </span>
  );
}
