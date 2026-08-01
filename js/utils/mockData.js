/**
 * Mock Data & Permission Definitions for Experiment 1.3
 */

export const ROLES = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
  GUEST: 'Guest'
};

export const PERMISSIONS = {
  READ_CONTENT: 'read:content',
  CREATE_CONTENT: 'create:content',
  EDIT_CONTENT: 'edit:content',
  DELETE_CONTENT: 'delete:content',
  MANAGE_USERS: 'manage:users',
  VIEW_AUDIT_LOGS: 'view:audit_logs',
  SYSTEM_SETTINGS: 'system:settings'
};

export const ROLE_PERMISSIONS_MAP = {
  [ROLES.ADMIN]: [
    PERMISSIONS.READ_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.SYSTEM_SETTINGS
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.READ_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.READ_CONTENT
  ],
  [ROLES.GUEST]: []
};

export const DEMO_USERS = [
  {
    id: 'usr_admin_101',
    email: 'admin@system.io',
    password: 'admin123',
    name: 'Dr. Alex Vance',
    role: ROLES.ADMIN,
    avatar: 'fa-user-gear',
    permissions: ROLE_PERMISSIONS_MAP[ROLES.ADMIN],
    department: 'Cybersecurity Architecture'
  },
  {
    id: 'usr_editor_202',
    email: 'editor@system.io',
    password: 'editor123',
    name: 'Sarah Jenkins',
    role: ROLES.EDITOR,
    avatar: 'fa-user-pen',
    permissions: ROLE_PERMISSIONS_MAP[ROLES.EDITOR],
    department: 'Content & Technical Docs'
  },
  {
    id: 'usr_viewer_303',
    email: 'viewer@system.io',
    password: 'viewer123',
    name: 'Mark Reynolds',
    role: ROLES.VIEWER,
    avatar: 'fa-user-check',
    permissions: ROLE_PERMISSIONS_MAP[ROLES.VIEWER],
    department: 'Quality Assurance'
  }
];

export const INITIAL_ARTICLES = [
  {
    id: 'art-001',
    title: 'Stateless Authentication Architecture using JWTs',
    category: 'Security Engineering',
    author: 'Dr. Alex Vance',
    date: '2026-07-28',
    summary: 'Detailed study on session management scalability without server-side storage overhead.'
  },
  {
    id: 'art-002',
    title: 'Implementing Strict RBAC Guards in Modern Web SPAs',
    category: 'Access Control',
    author: 'Sarah Jenkins',
    date: '2026-07-30',
    summary: 'Best practices for route interception, conditional component rendering, and permission matrices.'
  },
  {
    id: 'art-003',
    title: 'Mitigating XSS and CSRF Risks in Token Storage',
    category: 'Vulnerability Analysis',
    author: 'Dr. Alex Vance',
    date: '2026-08-01',
    summary: 'Evaluating localStorage vs HttpOnly cookies for storing JWT authorization credentials.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'log-101', timestamp: '2026-08-02 01:20:14', actor: 'admin@system.io', action: 'JWT_TOKEN_ISSUED', details: 'Role: Admin, TTL: 300s', status: 'SUCCESS' },
  { id: 'log-102', timestamp: '2026-08-02 01:22:45', actor: 'editor@system.io', action: 'CONTENT_CREATED', details: 'Article ID: art-002', status: 'SUCCESS' },
  { id: 'log-103', timestamp: '2026-08-02 01:25:10', actor: 'viewer@system.io', action: 'DELETE_ATTEMPT', details: 'Attempted to delete art-001 without delete:content permission', status: 'FORBIDDEN (403)' },
  { id: 'log-104', timestamp: '2026-08-02 01:30:00', actor: 'guest', action: 'PROTECTED_ROUTE_ACCESS', details: 'Attempted access to /admin console', status: 'UNAUTHORIZED (401)' }
];
