/**
 * RBAC Permission Matrix & Guard Simulator View (Experiment 1.3.2 Core Tool)
 */

import { authStore } from '../authState.js';
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS_MAP } from '../utils/mockData.js';
import { showToast } from '../components/toast.js';

export function renderRbacMatrixView() {
  const currentRole = authStore.user && authStore.verification.valid ? authStore.user.role : 'Guest';

  const capabilities = [
    { key: PERMISSIONS.READ_CONTENT, label: 'Read Content Items', scope: 'Public View' },
    { key: PERMISSIONS.CREATE_CONTENT, label: 'Create Articles', scope: 'Content Studio' },
    { key: PERMISSIONS.EDIT_CONTENT, label: 'Edit Articles', scope: 'Content Studio' },
    { key: PERMISSIONS.DELETE_CONTENT, label: 'Delete Articles', scope: 'Content Studio (Admin Only)' },
    { key: PERMISSIONS.MANAGE_USERS, label: 'Manage System Users', scope: 'Admin Console' },
    { key: PERMISSIONS.VIEW_AUDIT_LOGS, label: 'Inspect Security Audit Logs', scope: 'Audit Console' },
    { key: PERMISSIONS.SYSTEM_SETTINGS, label: 'Configure System Settings', scope: 'Admin Console' }
  ];

  const rolesList = [ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER, ROLES.GUEST];

  return `
    <div class="page-header">
      <h2><i class="fa-solid fa-table-cells" style="color:var(--role-editor);"></i> RBAC Matrix & Access Guards</h2>
      <p>Role-Based Access Control specification matrix & live authorization route testing</p>
    </div>

    <!-- Active Identity Switcher Bar -->
    <div class="glass-card" style="margin-bottom:1.8rem;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Live Role Switcher & Identity Simulation</h3>
          <p style="font-size:0.85rem; color:var(--text-muted);">Click a role button to instantly re-authenticate as that role:</p>
        </div>

        <div style="display:flex; gap:0.6rem;">
          <button class="btn btn-sm ${currentRole === 'Admin' ? 'btn-primary' : 'btn-secondary'}" onclick="window.authStore.login('admin@system.io', 'admin123'); window.showToast('Switched to Admin Role', 'success');">
            <i class="fa-solid fa-crown"></i> Admin
          </button>
          <button class="btn btn-sm ${currentRole === 'Editor' ? 'btn-primary' : 'btn-secondary'}" onclick="window.authStore.login('editor@system.io', 'editor123'); window.showToast('Switched to Editor Role', 'success');">
            <i class="fa-solid fa-pen-to-square"></i> Editor
          </button>
          <button class="btn btn-sm ${currentRole === 'Viewer' ? 'btn-primary' : 'btn-secondary'}" onclick="window.authStore.login('viewer@system.io', 'viewer123'); window.showToast('Switched to Viewer Role', 'success');">
            <i class="fa-solid fa-eye"></i> Viewer
          </button>
          <button class="btn btn-sm ${currentRole === 'Guest' ? 'btn-primary' : 'btn-secondary'}" onclick="window.authStore.logout(); window.showToast('Logged out (Guest mode)', 'info');">
            <i class="fa-solid fa-lock"></i> Unauthenticated
          </button>
        </div>
      </div>
    </div>

    <!-- RBAC Matrix Table -->
    <div class="glass-card" style="margin-bottom:1.8rem;">
      <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
        <i class="fa-solid fa-list-check" style="color:var(--accent-purple);"></i> Authorization Capability Matrix
      </h3>

      <table class="matrix-table">
        <thead>
          <tr>
            <th>Permission Capability</th>
            <th>Resource Scope</th>
            ${rolesList.map(r => `
              <th style="text-align:center;">
                <span class="role-pill ${r.toLowerCase()}">${r}</span>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${capabilities.map(cap => `
            <tr>
              <td style="font-weight:600; color:white;">
                <code style="font-size:0.82rem; color:var(--accent-cyan);">${cap.key}</code>
                <div style="font-size:0.78rem; color:var(--text-muted); font-weight:400;">${cap.label}</div>
              </td>
              <td style="font-size:0.82rem; color:var(--text-dim);">${cap.scope}</td>
              ${rolesList.map(r => {
                const hasCap = (ROLE_PERMISSIONS_MAP[r] || []).includes(cap.key);
                const isActiveRole = currentRole === r;
                return `
                  <td style="text-align:center; background:${isActiveRole ? 'rgba(79,70,229,0.08)' : 'transparent'};">
                    <i class="fa-solid ${hasCap ? 'fa-circle-check check-icon' : 'fa-circle-xmark cross-icon'}"></i>
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Protected Route Guards Tester -->
    <div class="glass-card">
      <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:0.8rem;">
        <i class="fa-solid fa-shield-halved" style="color:var(--danger);"></i> Protected Route Guard Simulator
      </h3>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.2rem;">
        Test navigation route protection logic. If your active identity lacks mandatory permissions, the application will intercept navigation and trigger a <strong>403 Access Denied</strong> error view.
      </p>

      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window.authStore.navigateTo('dashboard')">
          <i class="fa-solid fa-chart-pie"></i> Route: /dashboard (Public/Auth)
        </button>
        <button class="btn btn-secondary" onclick="window.authStore.navigateTo('content')">
          <i class="fa-solid fa-layer-group"></i> Route: /content (Public/Auth)
        </button>
        <button class="btn btn-danger" onclick="window.authStore.navigateTo('admin')">
          <i class="fa-solid fa-lock"></i> Route: /admin (Protected: Admin Only)
        </button>
        <button class="btn btn-danger" onclick="window.authStore.navigateTo('audit-logs')">
          <i class="fa-solid fa-lock"></i> Route: /audit-logs (Protected: Admin Only)
        </button>
      </div>
    </div>
  `;
}
