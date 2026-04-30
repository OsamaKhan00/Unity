// Client-safe — no server imports. Used by both frontend and API routes.

export type Permission =
  | 'jobs.view'    | 'jobs.create'    | 'jobs.edit'    | 'jobs.delete'
  | 'applications.view' | 'applications.edit' | 'applications.delete'
  | 'people.view'  | 'people.manage'
  | 'projects.view'| 'projects.manage'
  | 'content.view' | 'content.edit'
  | 'companies.view' | 'companies.manage'
  | 'folders.view';

export interface PermissionDef {
  key: Permission;
  label: string;
  description: string;
}

export interface PermissionGroup {
  label: string;
  permissions: PermissionDef[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: 'Jobs',
    permissions: [
      { key: 'jobs.view',   label: 'View',   description: 'View job listings and details' },
      { key: 'jobs.create', label: 'Create', description: 'Post new job openings' },
      { key: 'jobs.edit',   label: 'Edit',   description: 'Modify existing job postings' },
      { key: 'jobs.delete', label: 'Delete', description: 'Permanently remove job postings' },
    ],
  },
  {
    label: 'Applications',
    permissions: [
      { key: 'applications.view',   label: 'View',   description: 'View candidate applications' },
      { key: 'applications.edit',   label: 'Edit',   description: 'Update status and recruiter assignment' },
      { key: 'applications.delete', label: 'Delete', description: 'Permanently remove applications' },
    ],
  },
  {
    label: 'People',
    permissions: [
      { key: 'people.view',   label: 'View',   description: 'View team members on the public site' },
      { key: 'people.manage', label: 'Manage', description: 'Add, edit, and remove team members' },
    ],
  },
  {
    label: 'Projects',
    permissions: [
      { key: 'projects.view',   label: 'View',   description: 'View case studies and projects' },
      { key: 'projects.manage', label: 'Manage', description: 'Add, edit, and delete projects' },
    ],
  },
  {
    label: 'Site Content',
    permissions: [
      { key: 'content.view', label: 'View', description: 'View site content configuration' },
      { key: 'content.edit', label: 'Edit', description: 'Edit headlines, stats, and values' },
    ],
  },
  {
    label: 'Companies',
    permissions: [
      { key: 'companies.view',   label: 'View',   description: 'View company listings' },
      { key: 'companies.manage', label: 'Manage', description: 'Add and edit companies' },
    ],
  },
  {
    label: 'Folders',
    permissions: [
      { key: 'folders.view', label: 'View', description: 'Access the recruiter and company folder system' },
    ],
  },
];

export const ALL_PERMISSIONS: Permission[] = PERMISSION_GROUPS.flatMap(g =>
  g.permissions.map(p => p.key)
);

export const DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  admin: [...ALL_PERMISSIONS],
  editor: [
    'jobs.view', 'jobs.create', 'jobs.edit',
    'applications.view', 'applications.edit',
    'people.view', 'people.manage',
    'projects.view', 'projects.manage',
    'content.view', 'content.edit',
    'companies.view',
    'folders.view',
  ],
  viewer: [
    'jobs.view',
    'applications.view',
    'people.view',
    'projects.view',
    'content.view',
    'companies.view',
    'folders.view',
  ],
};
