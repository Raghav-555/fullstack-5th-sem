/**
 * HTTP Interceptor Console View
 */

import { authStore } from '../authState.js';
import { verifyJwtToken, SECRET_KEY } from '../utils/jwtHelper.js';
import { PERMISSIONS } from '../utils/mockData.js';
import { showToast } from '../components/toast.js';

let logs = [
  { time: '01:30:15', method: 'GET', endpoint: '/api/v1/articles', status: 200, statusText: '200 OK', headerSent: 'Authorization: Bearer eyJhbGci...' },
  { time: '01:32:00', method: 'POST', endpoint: '/api/v1/articles', status: 201, statusText: '201 Created', headerSent: 'Authorization: Bearer eyJhbGci...' }
];

export function renderHttpConsoleView() {
  const token = authStore.token;

  return `
    <div class="page-header">
      <h2><i class="fa-solid fa-network-wired" style="color:var(--accent-cyan);"></i> HTTP Authorization Interceptor</h2>
      <p>Simulating client request header injection (<code>Authorization: Bearer &lt;token&gt;</code>) & server middleware validation</p>
    </div>

    <!-- Active Request Header Inspector Card -->
    <div class="glass-card" style="margin-bottom:1.5rem;">
      <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:0.8rem; display:flex; align-items:center; gap:0.5rem;">
        <i class="fa-solid fa-paper-plane" style="color:var(--primary-hover);"></i> Client Request Header Injector
      </h3>

      <div style="background:rgba(10,15,26,0.9); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); font-family:var(--font-code); font-size:0.85rem;">
        <div style="color:var(--text-dim);">// Axios / Fetch Interceptor Configuration</div>
        <div style="color:var(--accent-cyan); margin-top:0.4rem;">
          request.headers['Authorization'] = '<span style="color:var(--jwt-header);">Bearer</span> ' + <span style="color:var(--jwt-payload);">${token ? `'${token.slice(0, 32)}...'` : 'null'}</span>;
        </div>
      </div>
    </div>

    <!-- Interactive Mock Endpoint Trigger Grid -->
    <div class="glass-card" style="margin-bottom:1.5rem;">
      <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:1rem;">
        <i class="fa-solid fa-play" style="color:var(--success);"></i> Execute Mock API Requests
      </h3>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
        
        <button class="btn btn-secondary" id="btn-api-get-articles" style="justify-content:flex-start;">
          <span class="role-pill editor" style="font-size:0.7rem;">GET</span>
          <span>/api/v1/articles</span>
        </button>

        <button class="btn btn-secondary" id="btn-api-post-article" style="justify-content:flex-start;">
          <span class="role-pill admin" style="font-size:0.7rem;">POST</span>
          <span>/api/v1/articles</span>
        </button>

        <button class="btn btn-secondary" id="btn-api-delete-article" style="justify-content:flex-start;">
          <span class="role-pill guest" style="font-size:0.7rem; background:rgba(239,68,68,0.2); color:var(--danger);">DELETE</span>
          <span>/api/v1/articles/art-001</span>
        </button>

        <button class="btn btn-secondary" id="btn-api-get-users" style="justify-content:flex-start;">
          <span class="role-pill viewer" style="font-size:0.7rem;">GET</span>
          <span>/api/v1/admin/users</span>
        </button>

      </div>
    </div>

    <!-- Live Console Log Output -->
    <div class="glass-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h3 style="font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
          <i class="fa-solid fa-terminal" style="color:var(--accent-purple);"></i> Network Console Stream
        </h3>
        <button class="btn btn-secondary btn-sm" id="btn-clear-logs">Clear Logs</button>
      </div>

      <div class="console-output" id="console-log-box">
        ${logs.map(l => `
          <div class="log-entry">
            <span class="timestamp">[${l.time}]</span>
            <strong style="color:white; width:60px;">${l.method}</strong>
            <span style="color:var(--accent-cyan); flex:1;">${l.endpoint}</span>
            <span class="status-${l.status}">${l.statusText}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function attachHttpConsoleEventListeners() {
  const triggerApi = (method, endpoint, requiredPermission) => {
    const token = authStore.token;
    const now = new Date().toLocaleTimeString();
    let status = 200;
    let statusText = '200 OK';

    if (!token) {
      status = 401;
      statusText = '401 Unauthorized (Missing JWT Bearer Header)';
    } else {
      const verification = verifyJwtToken(token, SECRET_KEY);
      if (!verification.valid) {
        status = 401;
        statusText = `401 Unauthorized (${verification.error})`;
      } else if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
        status = 403;
        statusText = `403 Forbidden (Requires ${requiredPermission})`;
      }
    }

    logs.unshift({
      time: now,
      method,
      endpoint,
      status,
      statusText,
      headerSent: token ? `Authorization: Bearer ${token.slice(0, 20)}...` : 'Authorization: None'
    });

    showToast(`Request sent: ${method} ${endpoint} -> ${statusText}`, status === 200 ? 'success' : (status === 401 ? 'warning' : 'danger'));
    authStore.notify();
  };

  const btnGetArt = document.getElementById('btn-api-get-articles');
  if (btnGetArt) btnGetArt.addEventListener('click', () => triggerApi('GET', '/api/v1/articles', null));

  const btnPostArt = document.getElementById('btn-api-post-article');
  if (btnPostArt) btnPostArt.addEventListener('click', () => triggerApi('POST', '/api/v1/articles', PERMISSIONS.CREATE_CONTENT));

  const btnDelArt = document.getElementById('btn-api-delete-article');
  if (btnDelArt) btnDelArt.addEventListener('click', () => triggerApi('DELETE', '/api/v1/articles/art-001', PERMISSIONS.DELETE_CONTENT));

  const btnGetUsers = document.getElementById('btn-api-get-users');
  if (btnGetUsers) btnGetUsers.addEventListener('click', () => triggerApi('GET', '/api/v1/admin/users', PERMISSIONS.MANAGE_USERS));

  const btnClear = document.getElementById('btn-clear-logs');
  if (btnClear) btnClear.addEventListener('click', () => {
    logs = [];
    authStore.notify();
  });
}
