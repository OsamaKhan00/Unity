import { NextResponse } from 'next/server';
import { readJobs, writeJobs } from '@/lib/jobsData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = readJobs().find((j) => j.id === id);
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const jobs = readJobs();
  const index = jobs.findIndex((j) => j.id === id);

  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  jobs[index] = {
    ...jobs[index],
    title: String(body.title ?? jobs[index].title),
    company: String(body.company ?? jobs[index].company),
    type: String(body.type ?? jobs[index].type),
    vertical: String(body.vertical ?? jobs[index].vertical),
    salary: String(body.salary ?? jobs[index].salary),
    description: String(body.description ?? jobs[index].description),
  };

  writeJobs(jobs);
  return NextResponse.json(jobs[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const jobs = readJobs();
  const filtered = jobs.filter((j) => j.id !== id);

  if (filtered.length === jobs.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  writeJobs(filtered);
  return NextResponse.json({ success: true });
}
