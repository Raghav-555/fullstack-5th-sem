/**
 * Login Modal Component
 */

import { authStore } from '../authState.js';
import { DEMO_USERS } from '../utils/mockData.js';
import { showToast } from './toast.js';

export function renderLoginModal() {
  const container = document.getElementById('login-modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop">
      <div class="modal-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3 style="font-size:1.3rem; font-weight:800; display:flex; align-items:center; gap:0.6rem;">
            <i class="fa-solid fa-lock-open" style="color:var(--primary-hover);"></i> Authenticate Identity
          </h3>
          <button id="btn-close-modal" style="background:none; border:none; color:var(--text-muted); font-size:1.2rem; cursor:pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.2rem;">
          Select a pre-configured role identity below to issue a signed JWT token, or enter custom credentials:
        </p>

        <!-- Quick One-Click Preset Selection Cards -->
        <div class="quick-login-grid">
          <div class="user-preset-card" data-email="admin@system.io" data-password="admin123">
            <i class="fa-solid fa-crown" style="color:var(--role-admin);"></i>
            <strong style="font-size:0.85rem; display:block;">Admin</strong>
            <span style="font-size:0.72rem; color:var(--text-dim);">Full Access</span>
          </div>

          <div class="user-preset-card" data-email="editor@system.io" data-password="editor123">
            <i class="fa-solid fa-pen-to-square" style="color:var(--role-editor);"></i>
            <strong style="font-size:0.85rem; display:block;">Editor</strong>
            <span style="font-size:0.72rem; color:var(--text-dim);">Create & Edit</span>
          </div>

          <div class="user-preset-card" data-email="viewer@system.io" data-password="viewer123">
            <i class="fa-solid fa-eye" style="color:var(--role-viewer);"></i>
            <strong style="font-size:0.85rem; display:block;">Viewer</strong>
            <span style="font-size:0.72rem; color:var(--text-dim);">Read Only</span>
          </div>
        </div>

        <form id="login-form">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="login-email" class="form-control" placeholder="user@system.io" required value="admin@system.io">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" class="form-control" placeholder="••••••••" required value="admin123">
          </div>

          <div class="form-group">
            <label>Token Expiration Lifetime (TTL)</label>
            <select id="login-ttl" class="form-control">
              <option value="60">1 Minute (Fast Test Expiry)</option>
              <option value="300" selected>5 Minutes (Standard Lab)</option>
              <option value="900">15 Minutes (Extended Session)</option>
            </select>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
            <button type="button" id="btn-cancel-modal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">
              <i class="fa-solid fa-key"></i> Issue Signed JWT
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Close Handlers
  const closeModal = () => {
    container.innerHTML = '';
  };

  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });

  // Preset Card Handlers
  container.querySelectorAll('.user-preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const email = card.getAttribute('data-email');
      const password = card.getAttribute('data-password');
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = password;
    });
  });

  // Form Submit Handler
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const ttl = parseInt(document.getElementById('login-ttl').value, 10);

    const res = authStore.login(email, password, ttl);
    if (res.success) {
      showToast(`Authenticated as ${res.user.name} (${res.user.role})! Signed JWT token generated.`, 'success');
      closeModal();
    } else {
      showToast(res.error, 'danger');
    }
  });
}
