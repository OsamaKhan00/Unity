'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminInfo { email: string; role: string; name: string; }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [admin, setAdmin] = useState<AdminInfo | null>(null);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!isLogin) {
      fetch('/api/admin/me')
        .then(r => r.ok ? r.json() : null)
        .then(data => data && setAdmin(data));
    }
  }, [isLogin]);

  async function logout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      {admin && (
        <AdminSidebar role={admin.role} name={admin.name} email={admin.email} />
      )}
      {!admin && (
        <aside className="w-56 shrink-0 border-r border-gray-200 bg-white animate-pulse" />
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">Apex Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1">
              View site
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </Link>
            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
