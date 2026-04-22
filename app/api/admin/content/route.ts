import { NextResponse } from 'next/server';
import { readSiteContent, writeSiteContent } from '@/lib/contentData';

export async function GET() {
  return NextResponse.json(readSiteContent());
}

export async function PUT(request: Request) {
  const body = await request.json();
  const current = readSiteContent();
  const updated = { ...current, ...body };
  writeSiteContent(updated);
  return NextResponse.json(updated);
}
