/**
 * State Management & Authentication Provider for Experiment 1.3
 */

import { createJwtToken, verifyJwtToken, SECRET_KEY } from './utils/jwtHelper.js';
import { DEMO_USERS, ROLES, ROLE_PERMISSIONS_MAP } from './utils/mockData.js';
import { logAuditEvent } from './views/auditLogsView.js';

class AuthStore {
  constructor() {
    this.listeners = [];
    this.tickListeners = [];
    this.storageType = localStorage.getItem('jwt_storage_pref') || 'localStorage';
    this.token = this.getStoredToken();
    this.currentView = 'dashboard';
    this.verifyAndSyncState();
    
    // Timer ticker: updates TTL countdown without triggering heavy DOM teardowns
    setInterval(() => {
      if (this.token) {
        const wasValid = this.verification.valid;
        this.verifyAndSyncState();
        
        // Notify light timer listeners
        this.notifyTick();

        // If validity status changed (e.g. token expired just now), notify full app
        if (wasValid !== this.verification.valid) {
          this.notify();
        }
      }
    }, 1000);
  }

  getStorage() {
    if (this.storageType === 'localStorage') return localStorage;
    if (this.storageType === 'sessionStorage') return sessionStorage;
    return null; // inMemory
  }

  getStoredToken() {
    const storage = this.getStorage();
    if (storage) {
      return storage.getItem('jwt_access_token') || null;
    }
    return this.inMemoryToken || null;
  }

  setStoredToken(token) {
    this.token = token;
    const storage = this.getStorage();
    if (storage) {
      if (token) {
        storage.setItem('jwt_access_token', token);
      } else {
        storage.removeItem('jwt_access_token');
      }
    } else {
      this.inMemoryToken = token;
    }
  }

  setStorageType(type) {
    // Preserve existing token when switching storage
    const currentToken = this.token;
    
    // Clear old storage keys
    if (localStorage.getItem('jwt_access_token')) localStorage.removeItem('jwt_access_token');
    if (sessionStorage.getItem('jwt_access_token')) sessionStorage.removeItem('jwt_access_token');
    this.inMemoryToken = null;

    this.storageType = type;
    localStorage.setItem('jwt_storage_pref', type);

    if (currentToken) {
      this.setStoredToken(currentToken);
    }
    this.notify();
  }

  verifyAndSyncState() {
    if (!this.token) {
      this.user = null;
      this.decodedToken = null;
      this.verification = { valid: false, error: "Not logged in" };
      return;
    }

    const verification = verifyJwtToken(this.token, SECRET_KEY);
    this.verification = verification;

    if (verification.valid) {
      this.decodedToken = verification.payload;
      this.user = {
        id: verification.payload.sub,
        name: verification.payload.name,
        email: verification.payload.email,
        role: verification.payload.role,
        permissions: verification.payload.permissions || ROLE_PERMISSIONS_MAP[verification.payload.role] || []
      };
    } else {
      this.user = null;
      this.decodedToken = verification.payload || null;
    }
  }

  login(email, password, ttlSeconds = 300) {
    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!foundUser) {
      logAuditEvent(email, 'LOGIN_FAILED', 'Invalid credentials provided', 'FAILED (401)');
      return { success: false, error: "Invalid email or password credentials" };
    }

    const jwt = createJwtToken(foundUser, ttlSeconds);
    this.setStoredToken(jwt.rawToken);
    this.verifyAndSyncState();
    logAuditEvent(foundUser.email, 'JWT_TOKEN_ISSUED', `Role: ${foundUser.role}, TTL: ${ttlSeconds}s`, 'SUCCESS');
    this.notify();

    return { success: true, user: foundUser, token: jwt.rawToken };
  }

  logout() {
    const email = this.user ? this.user.email : 'guest';
    this.setStoredToken(null);
    this.verifyAndSyncState();
    logAuditEvent(email, 'LOGOUT', 'User ended JWT session', 'SUCCESS');
    this.notify();
  }

  // Force payload tampering to test signature verification in JWT Inspector
  tamperToken(newRole) {
    if (!this.token) return;
    const parts = this.token.split('.');
    if (parts.length !== 3) return;

    const payloadObj = verifyJwtToken(this.token).payload || {};
    payloadObj.role = newRole;
    payloadObj.permissions = ROLE_PERMISSIONS_MAP[newRole] || [];

    // Encode tampered payload without updating signature
    const newPayloadB64 = btoa(JSON.stringify(payloadObj)).replace(/=/g, '');
    this.token = `${parts[0]}.${newPayloadB64}.${parts[2]}`;
    this.setStoredToken(this.token);
    this.verifyAndSyncState();
    logAuditEvent(this.user ? this.user.email : 'attacker', 'PAYLOAD_TAMPERED', `Altered role claim to ${newRole}`, 'SECURITY_VIOLATION');
    this.notify();
  }

  hasPermission(permission) {
    if (!this.user || !this.verification.valid) return false;
    return (this.user.permissions || []).includes(permission);
  }

  hasRole(role) {
    if (!this.user || !this.verification.valid) return false;
    return this.user.role === role;
  }

  getRemainingSeconds() {
    if (!this.decodedToken || !this.decodedToken.exp) return 0;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return Math.max(0, this.decodedToken.exp - nowSeconds);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  onTick(listener) {
    this.tickListeners.push(listener);
    return () => {
      this.tickListeners = this.tickListeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this));
  }

  notifyTick() {
    this.tickListeners.forEach(l => l(this));
  }

  navigateTo(view) {
    this.currentView = view;
    this.notify();
  }
}

export const authStore = new AuthStore();
