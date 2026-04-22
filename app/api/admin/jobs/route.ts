import { NextResponse } from 'next/server';
import { readJobs, writeJobs, Job } from '@/lib/jobsData';

export async function GET() {
  return NextResponse.json(readJobs());
}

export async function POST(request: Request) {
  const body = await request.json();
  const jobs = readJobs();

  const newJob: Job = {
    id: Date.now().toString(),
    title: String(body.title ?? ''),
    company: String(body.company ?? ''),
    type: String(body.type ?? 'Full-time'),
    vertical: String(body.vertical ?? 'IT & Software'),
    salary: String(body.salary ?? ''),
    description: String(body.description ?? ''),
  };

  jobs.push(newJob);
  writeJobs(jobs);

  return NextResponse.json(newJob, { status: 201 });
}
