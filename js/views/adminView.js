/**
 * Admin Console View (Protected Route Guard - Admin Only)
 */

import { authStore } from '../authState.js';
import { DEMO_USERS } from '../utils/mockData.js';
import { renderForbiddenView } from './forbiddenView.js';

export function renderAdminView() {
  // Protected Route Check
  if (!authStore.hasRole('Admin')) {
    return renderForbiddenView('Admin');
  }

  return `
    <div class="page-header">
      <h2><i class="fa-solid fa-sliders" style="color:var(--role-admin);"></i> Admin Security Console</h2>
      <p>Protected route accessible exclusively by users with the Admin role claim</p>
    </div>

    <!-- Admin Status Banner -->
    <div class="glass-card" style="margin-bottom:1.5rem; border-left:4px solid var(--role-admin);">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <h3 style="font-size:1.1rem; font-weight:700; color:white;">
            <i class="fa-solid fa-user-shield" style="color:var(--role-admin); margin-right:0.5rem;"></i>
            Admin Privileges Verified
          </h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;">
            JWT Token sub: <code>${authStore.user.id}</code> | Signature Integrity: OK | Route Guard: Passed
          </p>
        </div>
        <span class="role-pill admin"><i class="fa-solid fa-crown"></i> ADMIN LEVEL</span>
      </div>
    </div>

    <!-- User Management Table -->
    <div class="glass-card" style="margin-bottom:1.5rem;">
      <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
        <i class="fa-solid fa-users-gear" style="color:var(--accent-cyan);"></i> Managed System Accounts
      </h3>

      <table class="matrix-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Assigned Role</th>
            <th>Department</th>
            <th>Token Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${DEMO_USERS.map(u => `
            <tr>
              <td style="font-weight:600; color:white;">
                <i class="fa-solid ${u.avatar}" style="margin-right:0.4rem; color:var(--text-muted);"></i>
                ${u.name}
              </td>
              <td style="font-family:var(--font-code); font-size:0.82rem; color:var(--accent-cyan);">${u.email}</td>
              <td>
                <span class="role-pill ${u.role.toLowerCase()}">${u.role}</span>
              </td>
              <td style="font-size:0.85rem; color:var(--text-muted);">${u.department}</td>
              <td>
                <span style="color:var(--success); font-size:0.8rem; font-weight:600;">
                  <i class="fa-solid fa-circle-check"></i> Provisioned
                </span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="alert('Admin Action: Edit user ${u.email}')">
                  <i class="fa-solid fa-gear"></i> Configure
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
