export { readJobs as getJobs } from './jobsData';

// Legacy named exports — read fresh from disk on every call
import { readJobs } from './jobsData';

export function getJobList() {
  return readJobs().map(({ description: _d, ...j }) => j);
}

export function getJobDescriptions(): Record<string, string> {
  return Object.fromEntries(readJobs().map((j) => [j.id, j.description]));
}
