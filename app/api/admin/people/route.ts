import { NextResponse } from 'next/server';
import { readPeople, writePeople, Person } from '@/lib/contentData';

export async function GET() {
  return NextResponse.json(readPeople());
}

export async function POST(request: Request) {
  const body = await request.json();
  const people = readPeople();

  const person: Person = {
    id: Date.now().toString(),
    name: String(body.name ?? ''),
    title: String(body.title ?? ''),
    area: String(body.area ?? ''),
    bio: String(body.bio ?? ''),
    imageUrl: String(body.imageUrl ?? ''),
    linkedin: String(body.linkedin ?? ''),
    order: people.length + 1,
    active: body.active !== false,
  };

  people.push(person);
  writePeople(people);
  return NextResponse.json(person, { status: 201 });
}
