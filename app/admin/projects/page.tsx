'use client';
import { useState, useEffect } from 'react';

interface Project {
  id: string; title: string; client: string; vertical: string;
  outcome: string; year: string; imageUrl: string; featured: boolean; active: boolean;
}

const VERTICALS = ['IT & Software','Data Center','Pharmaceutical'];
const defaultForm = { title:'', client:'', vertical:'IT & Software', outcome:'', year: new Date().getFullYear().toString(), imageUrl:'', featured:false, active:true };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<Project|null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]         = useState({ ...defaultForm });
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string|null>(null);

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const r = await fetch('/api/admin/projects');
    if (r.ok) setProjects(await r.json());
    setLoading(false);
  }

  function openCreate() { setForm({ ...defaultForm }); setCreating(true); setEditing(null); }
  function openEdit(p: Project) { setForm({ title:p.title, client:p.client, vertical:p.vertical, outcome:p.outcome, year:p.year, imageUrl:p.imageUrl??'', featured:p.featured, active:p.active }); setEditing(p); setCreating(false); }
  function closeForm() { setEditing(null); setCreating(false); }
  function set(k: string, v: string|boolean) { setForm(f=>({ ...f,[k]:v })); }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/admin/projects/${editing.id}` : '/api/admin/projects';
    const r = await fetch(url, { method: editing?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    if (r.ok) { await fetchProjects(); closeForm(); }
    setSaving(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    await fetch(`/api/admin/projects/${id}`, { method:'DELETE' });
    setProjects(p => p.filter(x=>x.id!==id));
    setDeleting(null);
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

  const verticalColor: Record<string,string> = { 'IT & Software':'bg-blue-100 text-blue-700','Data Center':'bg-slate-100 text-slate-700','Pharmaceutical':'bg-emerald-100 text-emerald-700' };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">Case studies &amp; engagements shown on the public site</p>
        </div>
        <button onClick={openCreate} className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium">
          + Add Project
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-white rounded-xl border border-brand-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">{editing ? `Editing: ${editing.title}` : 'New Project'}</h2>
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Project Title *</label>
              <input required type="text" value={form.title} onChange={e=>set('title',e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Client</label>
              <input type="text" value={form.client} onChange={e=>set('client',e.target.value)} className={inputCls} placeholder="Confidential — Industry" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
              <input type="text" value={form.year} onChange={e=>set('year',e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Vertical</label>
              <select value={form.vertical} onChange={e=>set('vertical',e.target.value)} className={inputCls}>
                {VERTICALS.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
              <input type="url" value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} className={inputCls} placeholder="https://images.unsplash.com/…" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Outcome / Description *</label>
              <textarea required rows={4} value={form.outcome} onChange={e=>set('outcome',e.target.value)} className={`${inputCls} resize-none`} />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)} className="rounded text-brand-600" />
                <span className="text-sm text-gray-700">Featured (shows with image card)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e=>set('active',e.target.checked)} className="rounded text-brand-600" />
                <span className="text-sm text-gray-700">Active (show on site)</span>
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
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No projects yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">Project</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Vertical</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Year</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.client}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${verticalColor[p.vertical]??'bg-gray-100 text-gray-700'}`}>{p.vertical}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 hidden md:table-cell">{p.year}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      {p.featured && <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full w-fit">Featured</span>}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${p.active ? 'bg-green-50 text-green-700':'bg-gray-100 text-gray-500'}`}>
                        {p.active?'Active':'Hidden'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(p)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                      <button onClick={() => handleDelete(p.id, p.title)} disabled={deleting===p.id} className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                        {deleting===p.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
