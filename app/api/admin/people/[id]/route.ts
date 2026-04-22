import { NextResponse } from 'next/server';
import { readPeople, writePeople } from '@/lib/contentData';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = readPeople().find((p) => p.id === id);
  if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(person);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const people = readPeople();
  const i = people.findIndex((p) => p.id === id);
  if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  people[i] = { ...people[i], ...body, id };
  writePeople(people);
  return NextResponse.json(people[i]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const people = readPeople();
  const filtered = people.filter((p) => p.id !== id);
  if (filtered.length === people.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writePeople(filtered);
  return NextResponse.json({ success: true });
}
