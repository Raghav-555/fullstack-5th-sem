/**
 * Theory & Lab Documentation View
 */

export function renderTheoryDocsView() {
  return `
    <div class="page-header">
      <h2><i class="fa-solid fa-book-bookmark" style="color:var(--primary-hover);"></i> Lab Manual & Security Theory</h2>
      <p>Comprehensive Documentation for JWT Authentication and Role-Based Access Control (RBAC)</p>
    </div>

    <!-- CO Mapping Banner -->
    <div class="glass-card" style="margin-bottom:1.8rem; border-left:4px solid var(--accent-cyan);">
      <div style="display:flex; gap:1.5rem; flex-wrap:wrap;">
        <div>
          <span style="font-size:0.72rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">COs Mapped</span>
          <div style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-top:0.2rem;">
            CO1 (BT1), CO2 (BT2), CO3 (BT3)
          </div>
        </div>
        <div>
          <span style="font-size:0.72rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Software Stack</span>
          <div style="font-size:0.95rem; font-weight:700; color:var(--jwt-payload); margin-top:0.2rem;">
            HTML5, JavaScript (ES6+), React Context Architecture, Base64Url JWT Engine
          </div>
        </div>
      </div>
    </div>

    <!-- Section: JWT Authentication -->
    <div class="glass-card" style="margin-bottom:2rem;">
      <h3 style="font-size:1.3rem; font-weight:800; color:var(--jwt-header); margin-bottom:0.8rem; display:flex; align-items:center; gap:0.6rem;">
        <i class="fa-solid fa-key"></i> JSON Web Token (JWT) Authentication
      </h3>

      <div style="margin-bottom:1.2rem;">
        <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">Aim & Objective:</h4>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">
          To design and implement a secure authentication system using JSON Web Tokens (JWT) for user login and session management in a stateless web application architecture.
        </p>
      </div>

      <div style="margin-bottom:1.2rem;">
        <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">Theory & Architecture:</h4>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:0.8rem;">
          Traditional session-based authentication relies on server-side session storage (such as database or Redis sessions). JWT authentication introduces a <strong>stateless approach</strong> where the server issues a digitally signed token containing user claims upon login. The client retains this token and transmits it inside the <code>Authorization: Bearer &lt;token&gt;</code> HTTP header for subsequent requests.
        </p>

        <div style="background:#f1f5f9; border:1px solid var(--border-subtle); padding:1.2rem; border-radius:var(--radius-md); font-family:var(--font-code); font-size:0.85rem; margin-bottom:1rem;">
          <div style="color:var(--jwt-header); font-weight:700;">1. Header (Algorithm & Token Type):</div>
          <div style="color:var(--text-muted); margin-bottom:0.6rem; padding-left:1rem;">Defines signing algorithm (e.g. HS256) and type ("JWT").</div>

          <div style="color:var(--jwt-payload); font-weight:700;">2. Payload (Claims & Identity Data):</div>
          <div style="color:var(--text-muted); margin-bottom:0.6rem; padding-left:1rem;">Contains registered claims (sub, iat, exp) and custom claims (role, permissions).</div>

          <div style="color:var(--jwt-signature); font-weight:700;">3. Signature (Integrity Guard):</div>
          <div style="color:var(--text-muted); padding-left:1rem;">Generated via: <code>HMACSHA256(base64Url(header) + "." + base64Url(payload), secretKey)</code></div>
        </div>
      </div>
    </div>

    <!-- Section: Role-Based Access Control -->
    <div class="glass-card">
      <h3 style="font-size:1.3rem; font-weight:800; color:var(--role-editor); margin-bottom:0.8rem; display:flex; align-items:center; gap:0.6rem;">
        <i class="fa-solid fa-shield-halved"></i> Role-Based Access Control (RBAC)
      </h3>

      <div style="margin-bottom:1.2rem;">
        <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">Aim & Objective:</h4>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">
          To implement role-based access control (RBAC) and secure application routes based on user permissions, ensuring dynamic UI rendering and unauthorized access redirection.
        </p>
      </div>

      <div style="margin-bottom:1.2rem;">
        <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">Theory & Principles:</h4>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">
          While <strong>authentication</strong> answers "Who are you?", <strong>authorization</strong> answers "What are you allowed to do?". RBAC assigns users specific roles (e.g. <strong>Admin</strong>, <strong>Editor</strong>, <strong>Viewer</strong>), where each role maps to a discrete set of granular permission strings (e.g. <code>delete:content</code>).
        </p>
      </div>

      <div style="background:#f1f5f9; border:1px solid var(--border-subtle); padding:1.2rem; border-radius:var(--radius-md); margin-top:1rem;">
        <h4 style="font-size:0.9rem; font-weight:700; color:var(--jwt-signature); margin-bottom:0.5rem;">Expected Outcome & Achievements:</h4>
        <ul style="padding-left:1.2rem; font-size:0.88rem; color:var(--text-muted); line-height:1.8;">
          <li>✔ Stateless authentication flow demonstrated with Base64URL JWT generation</li>
          <li>✔ Dynamic client token storage handling (localStorage vs sessionStorage)</li>
          <li>✔ Cryptographic HMAC-SHA256 signature verification and payload tampering detection</li>
          <li>✔ Protected Route Guard implementation intercepting unauthorized navigation to 403 Forbidden screens</li>
          <li>✔ Dynamic UI element rendering based on active role permissions</li>
        </ul>
      </div>
    </div>
  `;
}
