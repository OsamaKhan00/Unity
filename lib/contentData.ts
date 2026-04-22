import fs from 'fs';
import path from 'path';

export interface Person {
  id: string;
  name: string;
  title: string;
  area: string;
  bio: string;
  imageUrl?: string;
  linkedin?: string;
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
  imageUrl?: string;
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

function readJson<T>(filename: string): T {
  const p = path.join(process.cwd(), 'data', filename);
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
}

function writeJson<T>(filename: string, data: T): void {
  const p = path.join(process.cwd(), 'data', filename);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
}

export const readPeople = (): Person[] => readJson<Person[]>('people.json');
export const writePeople = (d: Person[]) => writeJson('people.json', d);

export const readProjects = (): Project[] => readJson<Project[]>('projects.json');
export const writeProjects = (d: Project[]) => writeJson('projects.json', d);

export const readSiteContent = (): SiteContent => readJson<SiteContent>('site_content.json');
export const writeSiteContent = (d: SiteContent) => writeJson('site_content.json', d);
