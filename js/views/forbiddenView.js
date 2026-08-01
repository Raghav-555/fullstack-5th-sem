/**
 * 403 Forbidden / Access Denied View
 */

import { authStore } from '../authState.js';
import { renderLoginModal } from '../components/loginModal.js';

export function renderForbiddenView(requiredRole = 'Admin') {
  const isAuth = authStore.user && authStore.verification.valid;
  const currentRole = isAuth ? authStore.user.role : 'Guest';

  return `
    <div class="forbidden-container glass-card" style="margin-top: 2rem;">
      <div class="forbidden-icon">
        <i class="fa-solid fa-user-slash"></i>
      </div>
      <h2 style="font-size: 2rem; font-weight: 800; color: var(--danger); margin-bottom: 0.5rem;">
        403 - Access Denied
      </h2>
      <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 1.5rem;">
        Your current session identity (<strong>${currentRole}</strong>) lacks the mandatory role permission 
        <span class="role-pill admin" style="display:inline-flex;"><i class="fa-solid fa-crown"></i> ${requiredRole}</span> to access this protected route guard.
      </p>

      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 1.2rem; border-radius: var(--radius-md); font-family: var(--font-code); font-size: 0.82rem; text-align: left; margin-bottom: 1.8rem; color: #fca5a5;">
        <div><strong>HTTP Status:</strong> 403 Forbidden</div>
        <div><strong>RBAC Guard Condition:</strong> requireRole('${requiredRole}')</div>
        <div><strong>Active User Claims:</strong> ${isAuth ? JSON.stringify({ sub: authStore.user.id, role: authStore.user.role }) : 'Unauthenticated (No JWT present)'}</div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-secondary" onclick="window.authStore.navigateTo('dashboard')">
          <i class="fa-solid fa-house"></i> Return to Dashboard
        </button>
        <button class="btn btn-primary" id="btn-forbidden-login">
          <i class="fa-solid fa-user-gear"></i> Authenticate as ${requiredRole}
        </button>
      </div>
    </div>
  `;
}
