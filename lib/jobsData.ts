import fs from 'fs';
import path from 'path';

export interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  vertical: string;
  salary: string;
  description: string;
}

const dataPath = path.join(process.cwd(), 'data', 'jobs.json');

export function readJobs(): Job[] {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw) as Job[];
  } catch {
    return [];
  }
}

export function writeJobs(jobs: Job[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(jobs, null, 2), 'utf-8');
}
