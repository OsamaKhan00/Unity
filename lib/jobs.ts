import { createAdminClient } from './supabase/admin';
import { Job } from './jobsData';

export async function getJobs(): Promise<Job[]> {
  const { data } = await createAdminClient().from('jobs').select('*');
  return (data ?? []) as Job[];
}

export async function getJobList(): Promise<Omit<Job, 'description'>[]> {
  const jobs = await getJobs();
  return jobs.map(({ description: _d, ...j }) => j);
}

export async function getJobDescriptions(): Promise<Record<string, string>> {
  const jobs = await getJobs();
  return Object.fromEntries(jobs.map((j) => [j.id, j.description]));
}
