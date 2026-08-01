/**
 * Dashboard View Component
 */

import { authStore } from '../authState.js';
import { renderLoginModal } from '../components/loginModal.js';

export function renderDashboardView() {
  const isAuth = authStore.user && authStore.verification.valid;
  const user = authStore.user;
  const role = isAuth ? user.role : 'Guest';

  return `
    <div class="page-header">
      <h2><i class="fa-solid fa-chart-pie" style="color:var(--primary-hover);"></i> Security Dashboard</h2>
      <p>Overview of current stateless JWT session authentication and role permissions</p>
    </div>

    <!-- Active Session Overview Card -->
    <div class="glass-card" style="margin-bottom: 2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:1rem; margin-bottom:1.2rem;">
        <h3 style="font-size:1.1rem; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
          <i class="fa-solid fa-id-card" style="color:var(--accent-cyan);"></i> Active Session Identity
        </h3>
        ${isAuth ? `
          <span class="role-pill ${role.toLowerCase()}">
            <i class="fa-solid fa-shield"></i> ${role} Authenticated
          </span>
        ` : `
          <span class="role-pill guest">
            <i class="fa-solid fa-lock"></i> Unauthenticated Session
          </span>
        `}
      </div>

      ${isAuth ? `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.2rem;">
          <div style="background:rgba(15,23,42,0.6); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; color:var(--text-muted); uppercase; font-weight:700;">USER NAME</div>
            <div style="font-size:1.1rem; font-weight:700; margin-top:0.2rem; color:white;">${user.name}</div>
          </div>
          <div style="background:rgba(15,23,42,0.6); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; color:var(--text-muted); uppercase; font-weight:700;">EMAIL CLAIM</div>
            <div style="font-size:1rem; font-weight:600; margin-top:0.2rem; color:var(--accent-cyan);">${user.email}</div>
          </div>
          <div style="background:rgba(15,23,42,0.6); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; color:var(--text-muted); uppercase; font-weight:700;">ACTIVE STORAGE</div>
            <div style="font-size:1rem; font-weight:600; margin-top:0.2rem; color:var(--accent-purple);">${authStore.storageType}</div>
          </div>
          <div style="background:rgba(15,23,42,0.6); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; color:var(--text-muted); uppercase; font-weight:700;">SIGNATURE INTEGRITY</div>
            <div style="font-size:0.95rem; font-weight:700; margin-top:0.2rem; color:var(--success);">
              <i class="fa-solid fa-circle-check"></i> HMAC-SHA256 Valid
            </div>
          </div>
        </div>

        <div style="margin-top:1.5rem;">
          <h4 style="font-size:0.85rem; font-weight:700; color:var(--text-muted); margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">
            Active Granted Permissions (${user.permissions.length})
          </h4>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            ${user.permissions.map(p => `
              <span style="background:rgba(79,70,229,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3); padding:0.3rem 0.7rem; border-radius:9999px; font-size:0.78rem; font-family:var(--font-code);">
                <i class="fa-solid fa-key" style="font-size:0.7rem; margin-right:0.3rem;"></i> ${p}
              </span>
            `).join('')}
          </div>
        </div>
      ` : `
        <div style="text-align:center; padding:2rem 1rem;">
          <i class="fa-solid fa-user-lock" style="font-size:3rem; color:var(--text-dim); margin-bottom:1rem;"></i>
          <h4 style="font-size:1.2rem; font-weight:700;">No JWT Session Token Active</h4>
          <p style="color:var(--text-muted); font-size:0.9rem; max-width:500px; margin:0.5rem auto 1.5rem;">
            You are currently accessing the application as a guest. Authenticate with a pre-configured role to inspect JWT token claims and test RBAC permissions.
          </p>
          <button class="btn btn-primary" id="btn-dash-login">
            <i class="fa-solid fa-key"></i> Authenticate / Issue Token
          </button>
        </div>
      `}
    </div>

    <!-- Quick Feature Grid -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
      
      <div class="glass-card" style="cursor:pointer;" onclick="window.authStore.navigateTo('jwt-inspector')">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.8rem;">
          <div style="background:rgba(244,63,94,0.15); color:var(--jwt-header); padding:0.75rem; border-radius:var(--radius-md);">
            <i class="fa-solid fa-code" style="font-size:1.2rem;"></i>
          </div>
          <div>
            <h4 style="font-size:1rem; font-weight:700;">JWT Debugger</h4>
            <span style="font-size:0.78rem; color:var(--text-muted);">Inspect Header, Payload & Signature</span>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
          Decode Base64Url claims, test cryptographic HMAC signature verification, and tamper with token payloads in real-time.
        </p>
      </div>

      <div class="glass-card" style="cursor:pointer;" onclick="window.authStore.navigateTo('rbac-matrix')">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.8rem;">
          <div style="background:rgba(59,130,246,0.15); color:var(--role-editor); padding:0.75rem; border-radius:var(--radius-md);">
            <i class="fa-solid fa-table-cells" style="font-size:1.2rem;"></i>
          </div>
          <div>
            <h4 style="font-size:1rem; font-weight:700;">RBAC Matrix</h4>
            <span style="font-size:0.78rem; color:var(--text-muted);">Permission Rights & Role Comparator</span>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
          Compare Admin, Editor, and Viewer permission capabilities side-by-side and test live route protection guards.
        </p>
      </div>

      <div class="glass-card" style="cursor:pointer;" onclick="window.authStore.navigateTo('http-console')">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.8rem;">
          <div style="background:rgba(6,182,212,0.15); color:var(--accent-cyan); padding:0.75rem; border-radius:var(--radius-md);">
            <i class="fa-solid fa-network-wired" style="font-size:1.2rem;"></i>
          </div>
          <div>
            <h4 style="font-size:1rem; font-weight:700;">HTTP Bearer Interceptor</h4>
            <span style="font-size:0.78rem; color:var(--text-muted);">Authorization Header Inspector</span>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
          Visualize client-side request headers sending <code>Authorization: Bearer &lt;token&gt;</code> to simulated server endpoints.
        </p>
      </div>

    </div>
  `;
}
