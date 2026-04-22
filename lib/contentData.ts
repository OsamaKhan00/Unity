export interface Person {
  id: string;
  name: string;
  title: string;
  area: string;
  bio: string;
  imageUrl: string;
  linkedin: string;
  order: number;
  active: boolean;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  vertical: string;
  outcome: string;
  year: string;
  imageUrl: string;
  featured: boolean;
  active: boolean;
}

export interface SiteContent {
  hero_headline: string;
  hero_subheading: string;
  hero_badge: string;
  mission_statement: string;
  stats: Array<{ value: string; label: string }>;
  services: Array<{ title: string; desc: string; href: string; icon: string }>;
  why_us: Array<{ title: string; desc: string }>;
  about_tagline: string;
  about_intro: string;
  cta_headline: string;
  cta_subheading: string;
  values: Array<{ title: string; desc: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function personFromRow(r: any): Person {
  return {
    id: r.id,
    name: r.name,
    title: r.title ?? '',
    area: r.area ?? '',
    bio: r.bio ?? '',
    imageUrl: r.image_url ?? '',
    linkedin: r.linkedin ?? '',
    order: r.order ?? 0,
    active: r.active ?? true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function personToRow(p: Person | Partial<Person>): any {
  const row: Record<string, unknown> = {};
  if (p.id        !== undefined) row.id        = p.id;
  if (p.name      !== undefined) row.name      = p.name;
  if (p.title     !== undefined) row.title     = p.title;
  if (p.area      !== undefined) row.area      = p.area;
  if (p.bio       !== undefined) row.bio       = p.bio;
  if (p.imageUrl  !== undefined) row.image_url = p.imageUrl;
  if (p.linkedin  !== undefined) row.linkedin  = p.linkedin;
  if (p.order     !== undefined) row.order     = p.order;
  if (p.active    !== undefined) row.active    = p.active;
  return row;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function projectFromRow(r: any): Project {
  return {
    id: r.id,
    title: r.title ?? '',
    client: r.client ?? '',
    vertical: r.vertical ?? '',
    outcome: r.outcome ?? '',
    year: r.year ?? '',
    imageUrl: r.image_url ?? '',
    featured: r.featured ?? false,
    active: r.active ?? true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function projectToRow(p: Project | Partial<Project>): any {
  const row: Record<string, unknown> = {};
  if (p.id       !== undefined) row.id        = p.id;
  if (p.title    !== undefined) row.title     = p.title;
  if (p.client   !== undefined) row.client    = p.client;
  if (p.vertical !== undefined) row.vertical  = p.vertical;
  if (p.outcome  !== undefined) row.outcome   = p.outcome;
  if (p.year     !== undefined) row.year      = p.year;
  if (p.imageUrl !== undefined) row.image_url = p.imageUrl;
  if (p.featured !== undefined) row.featured  = p.featured;
  if (p.active   !== undefined) row.active    = p.active;
  return row;
}
