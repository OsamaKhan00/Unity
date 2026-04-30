'use client';
import { useState, useEffect } from 'react';
import { PERMISSION_GROUPS, ALL_PERMISSIONS, DEFAULT_PERMISSIONS } from '@/lib/permissions';
import type { Permission } from '@/lib/permissions';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
  permissions: Permission[];
  permissionsUpdatedAt: string | null;
}

type Role = 'admin' | 'editor' | 'viewer';

const defaultForm = { email: '', name: '', role: 'editor' as Role, password: '', active: true };

const roleColors: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin:       'bg-brand-100 text-brand-700',
  editor:      'bg-amber-100 text-amber-700',
  viewer:      'bg-gray-100 text-gray-600',
};

export default function AdminUsersPage() {
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [loading, setLoading]     = useState(true);
  const [creating, setCreating]   = useState(false);
  const [editing, setEditing]     = useState<AdminUser | null>(null);
  const [form, setForm]           = useState({ ...defaultForm });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [deleting, setDeleting]   = useState<string | null>(null);
  // Permission editor state
  const [permUserId, setPermUserId]       = useState<string | null>(null);
  const [draftPerms, setDraftPerms]       = useState<Permission[]>([]);
  const [permSaving, setPermSaving]       = useState(false);
  const [permSuccess, setPermSuccess]     = useState(false);
  const [permError, setPermError]         = useState('');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const r = await fetch('/api/admin/users');
    if (r.status === 403) { setLoading(false); return; }
    if (r.ok) setUsers(await r.json());
    setLoading(false);
  }

  function openCreate() { setForm({ ...defaultForm }); setCreating(true); setEditing(null); setError(''); closePermEditor(); }
  function openEdit(u: AdminUser) { setForm({ email: u.email, name: u.name, role: u.role as Role, password: '', active: u.active }); setEditing(u); setCreating(false); setError(''); closePermEditor(); }
  function closeForm() { setEditing(null); setCreating(false); setError(''); }
  function set(k: string, v: string | boolean) { setForm(f => ({ ...f, [k]: v })); }

  function openPermEditor(u: AdminUser) {
    if (permUserId === u.id) { closePermEditor(); return; }
    closeForm();
    setPermUserId(u.id);
    setDraftPerms(u.permissions ?? []);
    setPermSuccess(false);
    setPermError('');
  }
  function closePermEditor() { setPermUserId(null); setDraftPerms([]); setPermSuccess(false); setPermError(''); }

  function togglePerm(p: Permission) {
    setDraftPerms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  }

  function applyPreset(role: Role) {
    setDraftPerms([...(DEFAULT_PERMISSIONS[role] ?? [])]);
  }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault(); setSaving(true); setError('');
    const url = editing ? `/api/admin/users/${editing.id}` : '/api/admin/users';
    const body = editing
      ? { name: form.name, role: form.role, active: form.active, ...(form.password ? { password: form.password } : {}) }
      : form;
    const r = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) { const d = await r.json(); setError(d.error ?? 'Failed'); setSaving(false); return; }
    await fetchUsers(); closeForm(); setSaving(false);
  }

  async function handleToggle(u: AdminUser) {
    await fetch(`/api/admin/users/${u.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !u.active }) });
    setUsers(us => us.map(x => x.id === u.id ? { ...x, active: !x.active } : x));
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Permanently remove "${email}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    setUsers(us => us.filter(x => x.id !== id));
    if (permUserId === id) closePermEditor();
    setDeleting(null);
  }

  async function handleSavePermissions(userId: string) {
    setPermSaving(true); setPermError(''); setPermSuccess(false);
    const r = await fetch(`/api/admin/users/${userId}/permissions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions: draftPerms }),
    });
    setPermSaving(false);
    if (!r.ok) { const d = await r.json(); setPermError(d.error ?? 'Failed to save'); return; }
    const updated = await r.json() as AdminUser;
    setUsers(us => us.map(u => u.id === userId ? { ...u, permissions: updated.permissions, permissionsUpdatedAt: updated.permissionsUpdatedAt } : u));
    setPermSuccess(true);
    setTimeout(() => setPermSuccess(false), 3000);
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading…</div>;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage portal access and fine-grained permissions per user</p>
        </div>
        <button onClick={openCreate} className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium">
          + Invite Admin
        </button>
      </div>

      {/* Create / Edit form */}
      {(creating || editing) && (
        <div className="bg-white rounded-xl border border-brand-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            {editing ? `Edit: ${editing.email}` : 'Invite New Admin'}
          </h2>
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
            {error && <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
              <input required type="text" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
              <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} disabled={!!editing} className={`${inputCls} ${editing ? 'bg-gray-50 text-gray-400' : ''}`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Base Role</label>
              <select value={form.role} onChange={e => set('role', e.target.value)} className={inputCls}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <p className="text-[11px] text-gray-400 mt-1">Default permissions for the role are applied automatically. You can customise them afterwards.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Password {editing && <span className="text-gray-400">(leave blank to keep current)</span>}
              </label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} minLength={editing ? 0 : 6} required={!editing} className={inputCls} placeholder={editing ? 'Leave blank to keep current' : 'Min 6 characters'} />
            </div>
            {editing && (
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="rounded text-brand-600" />
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

      {/* Users list */}
      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-sm mb-1">No additional admin users yet.</p>
            <p className="text-gray-400 text-xs">The super admin account is configured via environment variables.</p>
          </div>
        ) : (
          users.map(u => (
            <div key={u.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* User row */}
              <div className="flex items-center gap-4 px-5 py-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>

                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0 ${roleColors[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                  {u.role.replace('_', ' ')}
                </span>

                <button
                  onClick={() => handleToggle(u)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition shrink-0 ${u.active ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-700'}`}
                >
                  {u.active ? 'Active' : 'Suspended'}
                </button>

                <span className="text-xs text-gray-400 hidden lg:block shrink-0">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => openPermEditor(u)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${permUserId === u.id ? 'bg-brand-600 text-white border-brand-600' : 'border-brand-300 text-brand-600 hover:bg-brand-50'}`}
                  >
                    Permissions {permUserId === u.id ? '▲' : '▼'}
                  </button>
                  <button onClick={() => openEdit(u)} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Edit</button>
                  <button onClick={() => handleDelete(u.id, u.email)} disabled={deleting === u.id} className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                    {deleting === u.id ? '…' : 'Remove'}
                  </button>
                </div>
              </div>

              {/* Permission editor panel */}
              {permUserId === u.id && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Permissions — {u.name}</p>
                      {u.permissionsUpdatedAt && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Last updated {new Date(u.permissionsUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    {/* Quick presets */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 hidden sm:block">Quick set:</span>
                      {(['admin', 'editor', 'viewer'] as Role[]).map(r => (
                        <button
                          key={r}
                          onClick={() => applyPreset(r)}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-white hover:border-brand-400 hover:text-brand-700 transition capitalize"
                        >
                          {r}
                        </button>
                      ))}
                      <button
                        onClick={() => setDraftPerms([])}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-white hover:border-red-300 hover:text-red-600 transition"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>

                  {/* Permission matrix */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                    {PERMISSION_GROUPS.map(group => (
                      <div key={group.label} className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">{group.label}</p>
                        <div className="space-y-2">
                          {group.permissions.map(perm => (
                            <label key={perm.key} className="flex items-start gap-2.5 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={draftPerms.includes(perm.key)}
                                onChange={() => togglePerm(perm.key)}
                                className="mt-0.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 shrink-0"
                              />
                              <div>
                                <p className="text-xs font-semibold text-gray-800 group-hover:text-brand-700 transition">{perm.label}</p>
                                <p className="text-[11px] text-gray-400 leading-tight">{perm.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary + save */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{draftPerms.length}</span> of {ALL_PERMISSIONS.length} permissions granted
                    </p>
                    <div className="flex items-center gap-3">
                      {permSuccess && (
                        <span className="text-xs text-green-600 font-medium">Saved — takes effect immediately</span>
                      )}
                      {permError && (
                        <span className="text-xs text-red-500">{permError}</span>
                      )}
                      <button
                        onClick={closePermEditor}
                        className="text-sm text-gray-500 hover:text-gray-700 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSavePermissions(u.id)}
                        disabled={permSaving}
                        className="bg-brand-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
                      >
                        {permSaving ? 'Saving…' : 'Save Permissions'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
