import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Person, personFromRow, personToRow } from '@/lib/contentData';

export async function GET() {
  const { data, error } = await createAdminClient()
    .from('people').select('*').order('order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(personFromRow));
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<Person>;
  const { data: existing } = await createAdminClient().from('people').select('id');
  const newPerson: Person = {
    id: Date.now().toString(),
    name: String(body.name ?? ''),
    title: String(body.title ?? ''),
    area: String(body.area ?? ''),
    bio: String(body.bio ?? ''),
    imageUrl: String(body.imageUrl ?? ''),
    linkedin: String(body.linkedin ?? ''),
    order: (existing?.length ?? 0) + 1,
    active: body.active !== false,
  };
  const { data, error } = await createAdminClient()
    .from('people').insert(personToRow(newPerson)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(personFromRow(data), { status: 201 });
}
