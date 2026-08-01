# 🛡️ JWT Authentication & Role-Based Access Control (RBAC) Security Lab

[![Stack: Vanilla JS ES6+](https://img.shields.io/badge/Stack-HTML5%20%7C%20ES6%2B%20JS-yellow.svg)]()
[![Security: JWT & RBAC](https://img.shields.io/badge/Security-JWT%20%26%20RBAC-success.svg)]()
[![Vercel: Ready](https://img.shields.io/badge/Vercel-Deployment%20Ready-black.svg)]()

A comprehensive, interactive web application and security laboratory demonstrating stateless **JSON Web Token (JWT)** authentication, cryptographic signature integrity verification, and **Role-Based Access Control (RBAC)** protected route guards.

---

## 📋 Course Outcomes (CO) & Bloom's Taxonomy Mappings

| Course Outcome | Description | Bloom's Taxonomy Level |
| :--- | :--- | :--- |
| **CO1** | Understand web authentication & authorization paradigms | **BT1 (Remembering & Understanding)** |
| **CO2** | Implement stateless token-based sessions & RBAC permission models | **BT2 (Applying & Analyzing)** |
| **CO3** | Secure route guards, validate cryptographic signatures, and manage client storage | **BT3 (Evaluating & Implementing)** |

---

## 🎯 Key Objectives & Core Learning Outcomes

1. **Stateless Authentication Architecture**: Understand how JWTs replace traditional server-side session stores in distributed, scalable web systems.
2. **Cryptographic Token Verification**: Analyze Base64URL encoding vs. encryption, inspect token claims, and verify HMAC-SHA256 digital signatures to detect payload tampering.
3. **Granular RBAC Authorization**: Enforce role-based access control across distinct user tiers (**Admin**, **Editor**, **Viewer**, **Guest**) with dynamic UI element rendering and route interception.
4. **Secure Token Storage Management**: Evaluate client-side token storage strategies (`localStorage`, `sessionStorage`, and `In-Memory State`).
5. **HTTP Authorization Interceptors**: Visualize how client-side applications attach `Authorization: Bearer <token>` HTTP headers for server middleware validation.

## 🏗️ Conceptual Architecture & Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant Client as Client App (SPA)
    participant Auth as Auth Engine / Server
    participant Middleware as Server Authorization Middleware

    User->>Client: 1. Input Credentials (Email & Password)
    Client->>Auth: 2. POST /login (Credentials)
    Auth-->>Client: 3. Return Signed JWT (Header.Payload.Signature)
    Note over Client: 4. Store Token in Client Storage (localStorage / sessionStorage)
    
    User->>Client: 5. Access Protected Feature (/admin)
    Client->>Middleware: 6. GET /api/admin/users (Header: "Authorization: Bearer <token>")
    
    Note over Middleware: 7. Security Interception:<br/>• Extract Bearer Token<br/>• Verify HMAC-SHA256 Signature<br/>• Validate Expiration (exp)<br/>• Check Role Claims
    
    alt Valid Token & Authorized Role
        Middleware-->>Client: 200 OK (Requested Resource Data)
    else Invalid or Expired Token
        Middleware-->>Client: 401 Unauthorized (Authentication Failed)
    else Lacks Required Role Claims
        Middleware-->>Client: 403 Forbidden (Access Denied Screen)
    end
```

---

## 🌟 Highlighted Features

### 🔑 1. Interactive JWT Debugger & Inspector
- **3-Part Structure Breakdown**: Visual color-coded decomposition:
  - **Header** (Pink `#e11d48`): Signing algorithm (`HS256`) and token type (`JWT`).
  - **Payload** (Purple `#9333ea`): Claims (`sub`, `name`, `email`, `role`, `permissions`, `iat`, `exp`).
  - **Signature** (Cyan `#0284c7`): Cryptographic HMAC-SHA256 signature hash.
- **Payload Tampering Simulator**: Test altering token claims (e.g. escalating role from `Viewer` to `Admin` in the browser) without updating the secret key signature. Demonstrates how cryptographic signature verification detects tampering and rejects unauthorized access.
- **Real-Time Expiration Countdown**: Live TTL timer tracking token validity seconds.

### 🛡️ 2. Role-Based Access Control (RBAC) & Protected Route Guards
- **User Tiers**:
  - 👑 **Admin** (`admin@system.io`): Full administrative rights (`read`, `create`, `edit`, `delete`, `manage:users`, `view:audit_logs`).
  - ✍️ **Editor** (`editor@system.io`): Content creation & modification rights (`read`, `create`, `edit`).
  - 👁️ **Viewer** (`viewer@system.io`): Read-only privileges (`read`).
  - 🔒 **Guest**: Unauthenticated user state.
- **Protected Route Guards**: Routes like `/admin` (Admin Security Console) and `/audit-logs` (System Audit Logs) intercept unauthorized users and trigger a styled **403 Access Denied** screen.
- **Dynamic UI Rendering**: Action buttons (**Create**, **Edit**, **Delete**) in the Content Studio dynamically enable or lock based on active token claims (e.g., **Delete** is exclusively unlocked for Admin).

### 📡 3. HTTP Interceptor Console
- Simulates client API requests adding `Authorization: Bearer <token>` headers.
- Evaluates server response codes (`200 OK`, `401 Unauthorized`, `403 Forbidden`).

### 💾 4. Local Storage State Persistence
- All created, edited, or deleted content articles and security audit logs automatically persist in `localStorage` across page reloads. Includes a **"Reset Articles"** button to restore initial lab defaults at any time.

### 🎨 5. Clean Light Design System
- Crisp, professional slate theme (`#f8fafc` background, `#ffffff` cards, `#0f172a` typography) with **zero glow shadows** and flat 1px solid borders.

---

## 🚀 Quickstart & Local Development

No heavy build tools or Node.js runtime required! The application runs natively in any modern browser.

### Using Python HTTP Server:
```bash
python -m http.server 8080
```

### Using Node `serve` or Live Server:
```bash
npx serve .
```

Open `http://localhost:8080` in your web browser.
