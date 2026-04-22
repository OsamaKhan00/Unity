import { NextResponse } from 'next/server';
import { readJobs } from '@/lib/jobsData';

// Public read-only endpoint — no auth required
export async function GET() {
  return NextResponse.json(readJobs());
}
