'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const links = [
  { href: '/about',    label: 'About'    },
  { href: '/services', label: 'Services' },
  { href: '/people',   label: 'People'   },
  { href: '/projects', label: 'Projects' },
  { href: '/culture',  label: 'Culture'  },
  { href: '/careers',  label: 'Careers'  },
  { href: '/contact',  label: 'Contact'  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setUser(data.user));
      const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ?? null);
      });
      return () => listener.subscription.unsubscribe();
    } catch {
      // Supabase not configured yet
    }
  }, []);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch { /* noop */ }
    router.push('/');
    router.refresh();
  }

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? '';

  return (
    <nav className={`bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-200 transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
            <span className="text-white font-bold text-sm tracking-tight">A</span>
          </div>
          <span className="text-[1.05rem] font-bold tracking-tight text-gray-900">
            Apex <span className="text-brand-600">Talent Group</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5 text-sm font-medium text-gray-600">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  active
                    ? 'text-brand-700 font-semibold bg-brand-50'
                    : 'hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right: auth + CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {fullName ?? user.email?.split('@')[0]}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="hidden sm:block text-xs text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded hover:bg-gray-100 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/my-applications"
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                My Applications
              </Link>
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition ml-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition ${
                pathname === l.href ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex gap-2 mt-2">
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-brand-700 border border-brand-200 rounded-lg hover:bg-brand-50 transition">
                  My Profile
                </Link>
                <button onClick={() => { setMenuOpen(false); handleSignOut(); }} className="flex-1 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/my-applications" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-brand-700 border border-brand-200 rounded-lg hover:bg-brand-50 transition">
                  My Applications
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
