/**
 * Audit Logs View (Protected Route Guard - Admin Only)
 */

import { authStore } from '../authState.js';
import { INITIAL_AUDIT_LOGS } from '../utils/mockData.js';
import { renderForbiddenView } from './forbiddenView.js';

export function getStoredAuditLogs() {
  const stored = localStorage.getItem('jwt_rbac_audit_logs');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  localStorage.setItem('jwt_rbac_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
  return [...INITIAL_AUDIT_LOGS];
}

export function logAuditEvent(actor, action, details, status) {
  const logs = getStoredAuditLogs();
  logs.unshift({
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    actor,
    action,
    details,
    status
  });
  localStorage.setItem('jwt_rbac_audit_logs', JSON.stringify(logs));
}

export function renderAuditLogsView() {
  if (!authStore.hasRole('Admin')) {
    return renderForbiddenView('Admin');
  }

  const logs = getStoredAuditLogs();

  return `
    <div class="page-header">
      <h2><i class="fa-solid fa-shield-cat" style="color:var(--jwt-payload);"></i> System Audit Logs</h2>
      <p>Security trail monitoring authorization attempts, token issuances, and forbidden route interceptions (Persisted)</p>
    </div>

    <div class="glass-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem;">
        <h3 style="font-size:1.05rem; font-weight:700;">
          <i class="fa-solid fa-list-check" style="color:var(--jwt-signature); margin-right:0.4rem;"></i>
          Security Event Trail
        </h3>
        <button class="btn btn-secondary btn-sm" onclick="localStorage.setItem('jwt_rbac_audit_logs', JSON.stringify(window.INITIAL_AUDIT_LOGS || [])); window.authStore.notify();">
          Reset Audit Logs
        </button>
      </div>

      <table class="matrix-table">
        <thead>
          <tr>
            <th>Event ID</th>
            <th>Timestamp</th>
            <th>Actor / Identity</th>
            <th>Action</th>
            <th>Details / Claim Context</th>
            <th>Security Result</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map(log => `
            <tr>
              <td style="font-family:var(--font-code); font-size:0.8rem; color:var(--text-dim);">${log.id}</td>
              <td style="font-family:var(--font-code); font-size:0.8rem; color:var(--text-muted);">${log.timestamp}</td>
              <td style="font-weight:600; color:var(--text-main);">${log.actor}</td>
              <td style="font-family:var(--font-code); font-size:0.82rem; color:var(--jwt-payload);">${log.action}</td>
              <td style="font-size:0.85rem; color:var(--text-muted);">${log.details}</td>
              <td>
                <span class="${log.status.includes('SUCCESS') ? 'log-entry status-200' : 'log-entry status-403'}">
                  ${log.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
