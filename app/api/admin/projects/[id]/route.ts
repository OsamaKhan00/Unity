import { NextResponse } from 'next/server';
import { readProjects, writeProjects } from '@/lib/contentData';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = readProjects().find((p) => p.id === id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const projects = readProjects();
  const i = projects.findIndex((p) => p.id === id);
  if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  projects[i] = { ...projects[i], ...body, id };
  writeProjects(projects);
  return NextResponse.json(projects[i]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = readProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeProjects(filtered);
  return NextResponse.json({ success: true });
}
