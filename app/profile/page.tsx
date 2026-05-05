export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from '@/components/ProfileClient';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <ProfileClient
      userId={user.id}
      email={user.email!}
      initialFullName={user.user_metadata?.full_name ?? ''}
    />
  );
}
