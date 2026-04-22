import { redirect } from 'next/navigation';

// /admin/jobs redirects to /admin (dashboard holds the jobs table)
export default function AdminJobsRedirect() {
  redirect('/admin');
}
