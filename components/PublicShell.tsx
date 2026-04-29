'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthPromptModal from './AuthPromptModal';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;

    const seen = localStorage.getItem('seenHomeModal');
    if (seen) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setShowModal(true);
      }
    });
  }, [pathname]);

  function handleClose() {
    localStorage.setItem('seenHomeModal', '1');
    setShowModal(false);
  }

  function handleGuest() {
    localStorage.setItem('seenHomeModal', '1');
    setShowModal(false);
  }

  if (pathname?.startsWith('/admin')) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <>
      <AuthPromptModal
        isOpen={showModal}
        onClose={handleClose}
        onGuestClick={handleGuest}
        context="home"
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
