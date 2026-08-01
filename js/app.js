/**
 * Application Entry & Router Controller
 * Experiment 1.3: JWT Auth & RBAC Security Lab
 */

import { authStore } from './authState.js';
import { renderNavbar, updateNavbarTimer } from './components/navbar.js';
import { renderSidebar } from './components/sidebar.js';

// Views
import { renderDashboardView } from './views/dashboardView.js';
import { renderContentView, attachContentEventListeners } from './views/contentView.js';
import { renderAdminView } from './views/adminView.js';
import { renderAuditLogsView } from './views/auditLogsView.js';
import { renderJwtInspectorView, attachJwtInspectorEventListeners } from './views/jwtInspectorView.js';
import { renderRbacMatrixView } from './views/rbacMatrixView.js';
import { renderHttpConsoleView, attachHttpConsoleEventListeners } from './views/httpConsoleView.js';
import { renderTheoryDocsView } from './views/theoryDocsView.js';
import { renderLoginModal } from './components/loginModal.js';
import { showToast } from './components/toast.js';

// Expose store and global helpers to window for inline onclick handlers
window.authStore = authStore;
window.renderLoginModal = renderLoginModal;
window.showToast = showToast;

function renderApp() {
  // Render Navigation Elements
  renderNavbar();
  renderSidebar();

  // Render Viewport Content
  const viewport = document.getElementById('view-viewport');
  if (!viewport) return;

  const currentView = authStore.currentView;

  switch (currentView) {
    case 'dashboard':
      viewport.innerHTML = renderDashboardView();
      break;

    case 'content':
      viewport.innerHTML = renderContentView();
      attachContentEventListeners();
      break;

    case 'admin':
      viewport.innerHTML = renderAdminView();
      break;

    case 'audit-logs':
      viewport.innerHTML = renderAuditLogsView();
      break;

    case 'jwt-inspector':
      viewport.innerHTML = renderJwtInspectorView();
      attachJwtInspectorEventListeners();
      break;

    case 'rbac-matrix':
      viewport.innerHTML = renderRbacMatrixView();
      break;

    case 'http-console':
      viewport.innerHTML = renderHttpConsoleView();
      attachHttpConsoleEventListeners();
      break;

    case 'theory-docs':
      viewport.innerHTML = renderTheoryDocsView();
      break;

    default:
      viewport.innerHTML = renderDashboardView();
      break;
  }
}

// Initial Render & Subscribe to Auth State Changes
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  
  // Subscribe to full app structural changes
  authStore.subscribe(() => {
    renderApp();
  });

  // Lightweight 1-second ticker (updates timer text without tearing down DOM elements)
  authStore.onTick(() => {
    updateNavbarTimer();
  });
});
