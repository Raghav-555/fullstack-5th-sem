/**
 * JWT Helper Utility
 * Provides Base64URL encoding/decoding, token synthesis, and HMAC-SHA256 signature simulation
 */

export const SECRET_KEY = "jwt_rbac_experiment_super_secret_key_2026";

/**
 * Base64URL encode object or string
 */
export function base64UrlEncode(str) {
  const input = typeof str === 'object' ? JSON.stringify(str) : String(str);
  const base64 = btoa(unescape(encodeURIComponent(input)));
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64URL decode string back to JSON object or text
 */
export function base64UrlDecode(base64UrlStr) {
  try {
    let base64 = base64UrlStr
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    while (base64.length % 4) {
      base64 += '=';
    }
    const decodedStr = decodeURIComponent(escape(atob(base64)));
    try {
      return JSON.parse(decodedStr);
    } catch {
      return decodedStr;
    }
  } catch (err) {
    return null;
  }
}

/**
 * Generate simulated HMAC-SHA256 signature
 */
export function generateSignature(headerB64, payloadB64, secret = SECRET_KEY) {
  const stringToSign = `${headerB64}.${payloadB64}.${secret}`;
  // Simple hash algorithm for demonstration of cryptographic signature integrity
  let hash = 0;
  for (let i = 0; i < stringToSign.length; i++) {
    const char = stringToSign.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
  const signatureString = `sig_${hashHex}_${base64UrlEncode(secret.slice(0, 6))}`;
  return base64UrlEncode(signatureString);
}

/**
 * Generate a complete JWT token string
 */
export function createJwtToken(user, ttlSeconds = 300) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions || [],
    iat: nowSeconds,
    exp: nowSeconds + ttlSeconds,
    iss: "jwt-rbac-security-lab"
  };

  const headerB64 = base64UrlEncode(header);
  const payloadB64 = base64UrlEncode(payload);
  const signatureB64 = generateSignature(headerB64, payloadB64);

  return {
    rawToken: `${headerB64}.${payloadB64}.${signatureB64}`,
    header,
    payload,
    signatureB64,
    headerB64,
    payloadB64
  };
}

/**
 * Decode and verify token integrity and expiration
 */
export function verifyJwtToken(tokenString, secret = SECRET_KEY) {
  if (!tokenString || typeof tokenString !== 'string') {
    return { valid: false, error: "No token provided" };
  }

  const parts = tokenString.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: "Malformed JWT structure (Must contain 3 parts separated by dots)" };
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  const header = base64UrlDecode(headerB64);
  const payload = base64UrlDecode(payloadB64);

  if (!header || !payload) {
    return { valid: false, error: "Invalid Base64Url encoding in token" };
  }

  // Signature check
  const expectedSignature = generateSignature(headerB64, payloadB64, secret);
  const signatureMatch = expectedSignature === signatureB64;

  if (!signatureMatch) {
    return {
      valid: false,
      error: "Signature Verification Failed! (Token payload or header has been tampered with)",
      tampered: true,
      header,
      payload
    };
  }

  // Expiration check
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp && nowSeconds > payload.exp) {
    return {
      valid: false,
      error: `Token Expired! (Expired at ${new Date(payload.exp * 1000).toLocaleTimeString()})`,
      expired: true,
      header,
      payload
    };
  }

  return {
    valid: true,
    header,
    payload,
    headerB64,
    payloadB64,
    signatureB64
  };
}
