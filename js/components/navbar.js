/**
 * Top Navbar Component
 */

import { authStore } from '../authState.js';
import { renderLoginModal } from './loginModal.js';
import { showToast } from './toast.js';

export function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const isAuth = authStore.user && authStore.verification.valid;
  const role = isAuth ? authStore.user.role : 'Guest';
  const roleClass = role.toLowerCase();
  
  let roleIcon = 'fa-lock';
  if (role === 'Admin') roleIcon = 'fa-crown';
  if (role === 'Editor') roleIcon = 'fa-pen-to-square';
  if (role === 'Viewer') roleIcon = 'fa-eye';

  const timeString = formatRemainingTime();

  container.innerHTML = `
    <div class="brand-container">
      <div class="brand-logo">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      <div class="brand-title">
        <h1>JWT Auth & RBAC Security Lab</h1>
        <p>Stateless Authentication & Role-Based Access Control</p>
      </div>
    </div>

    <div class="nav-actions">
      <!-- Storage Mechanism Selector -->
      <div class="storage-selector-group" title="Select where the JWT token is stored on the client">
        <i class="fa-solid fa-database"></i>
        <span>Storage:</span>
        <select id="storage-select">
          <option value="localStorage" ${authStore.storageType === 'localStorage' ? 'selected' : ''}>localStorage</option>
          <option value="sessionStorage" ${authStore.storageType === 'sessionStorage' ? 'selected' : ''}>sessionStorage</option>
          <option value="inMemory" ${authStore.storageType === 'inMemory' ? 'selected' : ''}>In-Memory State</option>
        </select>
      </div>

      <!-- Live Role & Profile Card -->
      <div class="user-badge-card">
        <span class="role-pill ${roleClass}">
          <i class="fa-solid ${roleIcon}"></i> ${role}
        </span>
        ${isAuth ? `<span style="font-size: 0.85rem; font-weight:600;">${authStore.user.name}</span>` : '<span style="font-size: 0.85rem; color: var(--text-dim);">Unauthenticated</span>'}
      </div>

      <!-- Token TTL Timer -->
      <div id="ttl-timer-box" style="display: ${isAuth ? 'flex' : 'none'}; font-family: var(--font-code); font-size: 0.8rem; background: #f1f5f9; border: 1px solid var(--border-subtle); padding: 0.35rem 0.75rem; border-radius: var(--radius-md); align-items:center; gap:0.4rem;" title="JWT Token Expiration Timer">
        <i id="ttl-timer-icon" class="fa-solid fa-clock" style="color: var(--info)"></i>
        <span>TTL: <strong id="ttl-timer-value" style="color: var(--text-main)">${timeString}</strong></span>
      </div>

      <!-- Auth Action Button -->
      ${isAuth ? `
        <button id="btn-logout" class="btn btn-secondary btn-sm">
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      ` : `
        <button id="btn-login-trigger" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-right-to-bracket"></i> Authenticate / Login
        </button>
      `}
    </div>
  `;

  // Attach Event Listeners
  const storageSelect = document.getElementById('storage-select');
  if (storageSelect) {
    storageSelect.addEventListener('change', (e) => {
      authStore.setStorageType(e.target.value);
      showToast(`Token Storage changed to: ${e.target.value}`, 'info');
    });
  }

  const btnLogin = document.getElementById('btn-login-trigger');
  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      renderLoginModal();
    });
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      authStore.logout();
      showToast('Logged out successfully', 'info');
    });
  }
}

export function updateNavbarTimer() {
  const timerBox = document.getElementById('ttl-timer-box');
  const timerVal = document.getElementById('ttl-timer-value');
  const timerIcon = document.getElementById('ttl-timer-icon');

  const isAuth = authStore.user && authStore.verification.valid;
  if (!isAuth) {
    if (timerBox) timerBox.style.display = 'none';
    return;
  }

  if (timerBox) timerBox.style.display = 'flex';
  if (timerVal) {
    const remaining = authStore.getRemainingSeconds();
    timerVal.textContent = formatRemainingTime();
    if (remaining < 60) {
      timerVal.style.color = 'var(--danger)';
      if (timerIcon) timerIcon.style.color = 'var(--danger)';
    } else {
      timerVal.style.color = 'var(--text-main)';
      if (timerIcon) timerIcon.style.color = 'var(--info)';
    }
  }
}

function formatRemainingTime() {
  const remaining = authStore.getRemainingSeconds();
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
