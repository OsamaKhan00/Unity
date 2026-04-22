'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Person {
  id: string; name: string; title: string; area: string;
  bio: string; imageUrl: string; linkedin: string; order: number; active: boolean;
}

const AREAS = ['All Verticals','IT & Software','Data Center','Pharmaceutical','Candidate Relations','Operations','Other'];

const defaultForm = { name:'', title:'', area:'IT & Software', bio:'', imageUrl:'', linkedin:'', order:0, active:true };

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=1d4ed8&color=fff&bold=true`;
}

export default function AdminPeoplePage() {
  const [people, setPeople]   = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Person | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]       = useState(defaultForm);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string|null>(null);

  useEffect(() => { fetchPeople(); }, []);

  async function fetchPeople() {
    const r = await fetch('/api/admin/people');
    if (r.ok) setPeople(await r.json());
    setLoading(false);
  }

  function openCreate() { setForm({ ...defaultForm, order: people.length + 1 }); setCreating(true); setEditing(null); }
  function openEdit(p: Person) { setForm({ name:p.name, title:p.title, area:p.area, bio:p.bio, imageUrl:p.imageUrl??'', linkedin:p.linkedin??'', order:p.order, active:p.active }); setEditing(p); setCreating(false); }
  function closeForm() { setEditing(null); setCreating(false); }

  function set(k: string, v: string|number|boolean) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    const url  = editing ? `/api/admin/people/${editing.id}` : '/api/admin/people';
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">People</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage team members displayed on the public site</p>
        </div>
        <button onClick={openCreate} className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium">
          + Add Person
        </button>
      </div>

      {/* Inline form */}
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

      {/* List */}
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
    </div>
  );
}
