'use client';
import { useState, useEffect } from 'react';

interface AdminUser {
  id: string; email: string; name: string;
  role: string; active: boolean; createdAt: string;
}

type Role = 'admin' | 'editor' | 'viewer';

const defaultForm = { email:'', name:'', role:'editor' as Role, password:'', active:true };

const roleColors: Record<string,string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin:       'bg-brand-100 text-brand-700',
  editor:      'bg-amber-100 text-amber-700',
  viewer:      'bg-gray-100 text-gray-600',
};

const roleDesc: Record<string,string> = {
  admin:  'Can manage jobs, people, projects, and content',
  editor: 'Can create and edit content',
  viewer: 'Read-only access to the admin dashboard',
};

export default function AdminUsersPage() {
  const [users, setUsers]     = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing,  setEditing]  = useState<AdminUser|null>(null);
  const [form, setForm]       = useState({ ...defaultForm });
  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState('');
  const [deleting, setDeleting] = useState<string|null>(null);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const r = await fetch('/api/admin/users');
    if (r.status === 403) { setLoading(false); return; }
    if (r.ok) setUsers(await r.json());
    setLoading(false);
  }

  function openCreate() { setForm({ ...defaultForm }); setCreating(true); setEditing(null); setError(''); }
  function openEdit(u: AdminUser) { setForm({ email:u.email, name:u.name, role:u.role as Role, password:'', active:u.active }); setEditing(u); setCreating(false); setError(''); }
  function closeForm() { setEditing(null); setCreating(false); setError(''); }
  function set(k: string, v: string|boolean) { setForm(f=>({ ...f,[k]:v })); }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault(); setSaving(true); setError('');
    const url = editing ? `/api/admin/users/${editing.id}` : '/api/admin/users';
    const body = editing ? { name:form.name, role:form.role, active:form.active, ...(form.password?{password:form.password}:{}) } : form;
    const r = await fetch(url, { method:editing?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    if (!r.ok) { const d=await r.json(); setError(d.error??'Failed'); setSaving(false); return; }
    await fetchUsers(); closeForm(); setSaving(false);
  }

  async function handleToggle(u: AdminUser) {
    await fetch(`/api/admin/users/${u.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ active:!u.active }) });
    setUsers(us => us.map(x => x.id===u.id ? {...x,active:!x.active} : x));
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Permanently remove "${email}"?`)) return;
    setDeleting(id);
    await fetch(`/api/admin/users/${id}`, { method:'DELETE' });
    setUsers(us => us.filter(x=>x.id!==id));
    setDeleting(null);
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading…</div>;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage who can access this admin portal and what they can do</p>
        </div>
        <button onClick={openCreate} className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium">
          + Invite Admin
        </button>
      </div>

      {/* Role legend */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-amber-800 mb-2">Permission levels</p>
        <div className="grid sm:grid-cols-3 gap-2">
          {(['admin','editor','viewer'] as Role[]).map(r => (
            <div key={r} className="flex items-start gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${roleColors[r]}`}>{r}</span>
              <p className="text-xs text-amber-700">{roleDesc[r]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inline form */}
      {(creating || editing) && (
        <div className="bg-white rounded-xl border border-brand-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">{editing ? `Edit: ${editing.email}` : 'Invite New Admin'}</h2>
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
            {error && <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
              <input required type="text" value={form.name} onChange={e=>set('name',e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
              <input required type="email" value={form.email} onChange={e=>set('email',e.target.value)} disabled={!!editing} className={`${inputCls} ${editing?'bg-gray-50 text-gray-400':''}`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
              <select value={form.role} onChange={e=>set('role',e.target.value)} className={inputCls}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Password {editing && <span className="text-gray-400">(leave blank to keep current)</span>}
              </label>
              <input type="password" value={form.password} onChange={e=>set('password',e.target.value)} minLength={editing?0:6} required={!editing} className={inputCls} placeholder={editing ? 'Leave blank to keep current' : 'Min 6 characters'} />
            </div>
            {editing && (
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e=>set('active',e.target.checked)} className="rounded text-brand-600" />
                  <span className="text-sm text-gray-700">Account active</span>
                </label>
              </div>
            )}
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" disabled={saving} className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition">
                {saving ? 'Saving…' : editing ? 'Update' : 'Create Account'}
              </button>
              <button type="button" onClick={closeForm} className="text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 text-sm mb-1">No additional admin users yet.</p>
            <p className="text-gray-400 text-xs">The super admin account is configured via environment variables.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Role</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Status</th>
                <th className="px-5 py-3 text-left hidden lg:table-cell">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${roleColors[u.role]??'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <button onClick={() => handleToggle(u)} className={`text-xs font-medium px-2.5 py-1 rounded-full transition ${u.active ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-700'}`}>
                      {u.active ? 'Active' : 'Suspended'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 hidden lg:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(u)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                      <button onClick={() => handleDelete(u.id, u.email)} disabled={deleting===u.id} className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                        {deleting===u.id ? '…' : 'Remove'}
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
