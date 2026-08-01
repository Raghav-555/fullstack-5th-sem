/**
 * Sidebar Navigation Component
 */

import { authStore } from '../authState.js';

export function renderSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  const currentView = authStore.currentView;
  const isAuth = authStore.user && authStore.verification.valid;
  const role = isAuth ? authStore.user.role : 'Guest';

  const menuItems = [
    { section: 'APPLICATION VIEWS' },
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie', requiredRole: null },
    { id: 'content', label: 'Content Studio', icon: 'fa-layer-group', requiredRole: null },
    { id: 'admin', label: 'Admin Console', icon: 'fa-sliders', requiredRole: 'Admin', isProtected: true },
    { id: 'audit-logs', label: 'System Audit Logs', icon: 'fa-shield-cat', requiredRole: 'Admin', isProtected: true },

    { section: 'SECURITY LAB TOOLS' },
    { id: 'jwt-inspector', label: 'JWT Debugger', icon: 'fa-key', badge: 'JWT' },
    { id: 'rbac-matrix', label: 'RBAC Matrix', icon: 'fa-table-cells', badge: 'RBAC' },
    { id: 'http-console', label: 'HTTP Interceptor', icon: 'fa-network-wired', badge: 'API' },

    { section: 'DOCUMENTATION' },
    { id: 'theory-docs', label: 'Lab Manual & Theory', icon: 'fa-book-bookmark', badge: 'Guide' }
  ];

  let html = '';

  menuItems.forEach(item => {
    if (item.section) {
      html += `<div class="nav-section-label">${item.section}</div><div class="nav-menu-group">`;
      return;
    }

    const isActive = currentView === item.id;
    let isForbidden = false;
    if (item.requiredRole && role !== item.requiredRole) {
      isForbidden = true;
    }

    html += `
      <button class="nav-item-btn ${isActive ? 'active' : ''}" data-view="${item.id}">
        <i class="fa-solid ${item.icon}"></i>
        <span>${item.label}</span>
        ${item.isProtected ? `<span class="badge-tag lock"><i class="fa-solid fa-lock"></i> Admin</span>` : ''}
        ${item.badge && !item.isProtected ? `<span class="badge-tag">${item.badge}</span>` : ''}
      </button>
    `;
  });

  html += '</div>';
  container.innerHTML = html;

  // Add Click Handlers
  container.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.getAttribute('data-view');
      authStore.navigateTo(view);
    });
  });
}
