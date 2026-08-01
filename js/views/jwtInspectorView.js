/**
 * JWT Inspector & Debugger View (Experiment 1.3.1 Core Tool)
 */

import { authStore } from '../authState.js';
import { verifyJwtToken, SECRET_KEY } from '../utils/jwtHelper.js';
import { showToast } from '../components/toast.js';

export function renderJwtInspectorView() {
  const token = authStore.token;
  const isAuth = authStore.user && authStore.verification.valid;
  const verification = authStore.verification;

  let parts = token ? token.split('.') : [];
  const headerB64 = parts[0] || '';
  const payloadB64 = parts[1] || '';
  const signatureB64 = parts[2] || '';

  const headerObj = verification.header || (parts[0] ? JSON.parse(atob(parts[0])) : null);
  const payloadObj = verification.payload || (parts[1] ? JSON.parse(atob(parts[1])) : null);

  const remaining = authStore.getRemainingSeconds();

  return `
    <div class="page-header">
      <h2><i class="fa-solid fa-key" style="color:var(--jwt-payload);"></i> JWT Debugger & Inspector</h2>
      <p>Stateless JSON Web Token structure breakdown, Base64Url claims decoding & HMAC signature verification</p>
    </div>

    ${!token ? `
      <div class="glass-card" style="text-align:center; padding:3rem 1.5rem;">
        <i class="fa-solid fa-key" style="font-size:3rem; color:var(--jwt-header); margin-bottom:1rem;"></i>
        <h3 style="font-size:1.2rem; font-weight:700;">No Active JWT Token Found</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; max-width:480px; margin:0.5rem auto 1.5rem;">
          Authenticate as a user to generate a signed JWT token or click below to issue a default Admin token:
        </p>
        <button class="btn btn-primary" onclick="window.authStore.login('admin@system.io', 'admin123'); window.showToast('Issued Admin JWT Token', 'success');">
          <i class="fa-solid fa-bolt"></i> Generate Sample JWT Token
        </button>
      </div>
    ` : `

      <!-- Raw Color-Coded Token Card -->
      <div class="glass-card" style="margin-bottom:1.8rem;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
            <i class="fa-solid fa-terminal" style="color:var(--accent-cyan);"></i> Raw Encoded JWT Token String
          </h3>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" id="btn-copy-token">
              <i class="fa-solid fa-copy"></i> Copy Token
            </button>
            <button class="btn btn-danger btn-sm" id="btn-tamper-role" title="Simulate attacker altering token claim in browser">
              <i class="fa-solid fa-bug"></i> Tamper Payload (Test Signature Guard)
            </button>
          </div>
        </div>

        <div class="jwt-raw-display">
          <span class="jwt-token-header" title="Header (Algorithm & Token Type)">${headerB64}</span><span class="jwt-token-dot">.</span><span class="jwt-token-payload" title="Payload (Claims & User Data)">${payloadB64}</span><span class="jwt-token-dot">.</span><span class="jwt-token-signature" title="HMAC-SHA256 Cryptographic Signature">${signatureB64}</span>
        </div>

        <!-- Verification Result Banner -->
        <div style="margin-top:1.2rem; padding:1rem 1.2rem; border-radius:var(--radius-md); background:${verification.valid ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; border:1px solid ${verification.valid ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}; display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:0.8rem;">
            <i class="fa-solid ${verification.valid ? 'fa-shield-check' : 'fa-triangle-exclamation'}" style="font-size:1.5rem; color:${verification.valid ? 'var(--success)' : 'var(--danger)'};"></i>
            <div>
              <strong style="font-size:0.95rem; color:${verification.valid ? 'var(--success)' : 'var(--danger)'};">
                ${verification.valid ? 'Token Status: SIGNATURE VERIFIED & VALID' : 'Token Status: INVALID / VERIFICATION FAILED'}
              </strong>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.1rem;">
                ${verification.valid ? `Secret Key: "${SECRET_KEY.slice(0, 15)}..." | Remaining TTL: ${remaining}s` : verification.error}
              </div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.authStore.login(window.authStore.user ? window.authStore.user.email : 'admin@system.io', 'admin123'); window.showToast('Re-issued fresh signed token', 'success');">
            <i class="fa-solid fa-arrows-rotate"></i> Re-issue Clean Token
          </button>
        </div>
      </div>

      <!-- Decoded 3-Part Grid Breakdown -->
      <div class="jwt-breakdown-grid">
        
        <!-- Header Card -->
        <div class="jwt-part-card">
          <div class="jwt-part-header header-color">
            <span><i class="fa-solid fa-heading"></i> HEADER: Algorithm & Typ</span>
            <span style="font-family:var(--font-code); font-size:0.75rem;">HS256</span>
          </div>
          <div class="jwt-part-body">${JSON.stringify(headerObj, null, 2)}</div>
        </div>

        <!-- Payload Card -->
        <div class="jwt-part-card">
          <div class="jwt-part-header payload-color">
            <span><i class="fa-solid fa-database"></i> PAYLOAD: User Claims</span>
            <span style="font-family:var(--font-code); font-size:0.75rem;">Sub & Roles</span>
          </div>
          <div class="jwt-part-body">${JSON.stringify(payloadObj, null, 2)}</div>
        </div>

        <!-- Signature Card -->
        <div class="jwt-part-card">
          <div class="jwt-part-header signature-color">
            <span><i class="fa-solid fa-signature"></i> SIGNATURE: Cryptographic Hash</span>
            <span style="font-family:var(--font-code); font-size:0.75rem;">HMAC-SHA256</span>
          </div>
          <div class="jwt-part-body" style="word-break:break-all;">
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)
          </div>
        </div>

      </div>
    `}
  `;
}

export function attachJwtInspectorEventListeners() {
  const btnCopy = document.getElementById('btn-copy-token');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      if (authStore.token) {
        navigator.clipboard.writeText(authStore.token);
        showToast('JWT raw token copied to clipboard!', 'success');
      }
    });
  }

  const btnTamper = document.getElementById('btn-tamper-role');
  if (btnTamper) {
    btnTamper.addEventListener('click', () => {
      authStore.tamperToken('Admin');
      showToast('⚠️ Tampered payload! Changed role claim without updating cryptographic signature.', 'warning');
    });
  }
}
