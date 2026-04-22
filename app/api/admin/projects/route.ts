import { NextResponse } from 'next/server';
import { readProjects, writeProjects, Project } from '@/lib/contentData';

export async function GET() {
  return NextResponse.json(readProjects());
}

export async function POST(request: Request) {
  const body = await request.json();
  const projects = readProjects();

  const project: Project = {
    id: Date.now().toString(),
    title: String(body.title ?? ''),
    client: String(body.client ?? ''),
    vertical: String(body.vertical ?? 'IT & Software'),
    outcome: String(body.outcome ?? ''),
    year: String(body.year ?? new Date().getFullYear()),
    imageUrl: String(body.imageUrl ?? ''),
    featured: body.featured === true,
    active: body.active !== false,
  };

  projects.push(project);
  writeProjects(projects);
  return NextResponse.json(project, { status: 201 });
}
