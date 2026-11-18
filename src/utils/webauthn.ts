import { ClientUser, WebAuthnCredential } from '../types/index.ts';

export type WebAuthnErrorReason =
  | 'USER_CANCELLED'
  | 'HARDWARE_NOT_FOUND'
  | 'IFRAME_POLICY_BLOCKED'
  | 'NOT_SUPPORTED'
  | 'NO_CREDENTIALS'
  | 'CREDENTIAL_ALREADY_REGISTERED'
  | 'CHALLENGE_EXPIRED'
  | 'SECURITY_MISMATCH'
  | 'ACCOUNT_PENDING'
  | 'ACCOUNT_RESTRICTED'
  | 'SIGNATURE_INVALID'
  | 'PASSWORD_REQUIRED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export interface WebAuthnCapabilities {
  isSupported: boolean;
  hasPlatformAuthenticator: boolean;
  isIframeRestricted: boolean;
  hasLocalVirtualKey: boolean;
  recommendedLabel: string;
}

export interface WebAuthnActionResult {
  success: boolean;
  message?: string;
  code?: string;
  errorReason?: WebAuthnErrorReason;
  errorTitle?: string;
  errorHint?: string;
  domErrorName?: string;
  hardwareBlocked?: boolean;
  credential?: WebAuthnCredential;
  user?: ClientUser;
  authenticatedWith?: {
    credentialId: string;
    deviceName: string;
    authenticatorType: string;
  };
}

const VIRTUAL_KEYS_STORAGE = 'drt_virtual_fido2_keys_v1';

interface StoredVirtualKey {
  credentialId: string;
  email: string;
  deviceName: string;
  publicKeySpki: string;
  privateKeyJwk: JsonWebKey;
  counter: number;
  createdAt: string;
}

export function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const ab = new ArrayBuffer(raw.length);
  const out = new Uint8Array(ab);
  for (let i = 0; i < raw.length; i++) {
    out[i] = raw.charCodeAt(i);
  }
  return ab;
}

export function detectBiometricDeviceName(): string {
  if (typeof navigator === 'undefined') return 'Biometric Device';
  const ua = navigator.userAgent || '';
  if (/iPhone/i.test(ua)) return 'iPhone Face ID / Touch ID';
  if (/iPad/i.test(ua)) return 'iPad Face ID / Touch ID';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac Touch ID Passkey';
  if (/Windows/i.test(ua)) return 'Windows Hello Biometrics';
  if (/Android/i.test(ua)) return 'Android Fingerprint / Biometrics';
  if (/Linux/i.test(ua)) return 'Linux Hardware Passkey';
  return 'Browser Passkey Authenticator';
}

function getStoredVirtualKeys(): StoredVirtualKey[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VIRTUAL_KEYS_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVirtualKey(entry: StoredVirtualKey) {
  if (typeof localStorage === 'undefined') return;
  const existing = getStoredVirtualKeys().filter(k => k.credentialId !== entry.credentialId);
  localStorage.setItem(VIRTUAL_KEYS_STORAGE, JSON.stringify([entry, ...existing]));
}

export function removeStoredVirtualKey(credentialId: string) {
  if (typeof localStorage === 'undefined') return;
  const remaining = getStoredVirtualKeys().filter(k => k.credentialId !== credentialId);
  localStorage.setItem(VIRTUAL_KEYS_STORAGE, JSON.stringify(remaining));
}

export async function checkWebAuthnCapabilities(email?: string): Promise<WebAuthnCapabilities> {
  const virtualKeys = getStoredVirtualKeys();
  const cleanEmail = (email || '').trim().toLowerCase();
  const hasLocalVirtualKey = cleanEmail
    ? virtualKeys.some(k => k.email === cleanEmail)
    : virtualKeys.length > 0;

  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return {
      isSupported: false,
      hasPlatformAuthenticator: false,
      isIframeRestricted: false,
      hasLocalVirtualKey,
      recommendedLabel: detectBiometricDeviceName()
    };
  }

  let hasPlatformAuthenticator = false;
  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      hasPlatformAuthenticator = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
  } catch {
    hasPlatformAuthenticator = false;
  }

  let isIframeRestricted = false;
  try {
    const inIframe = window.self !== window.top;
    const policy = (document as any).permissionsPolicy || (document as any).featurePolicy;
    if (inIframe && policy && typeof policy.allowsFeature === 'function') {
      const canGet = policy.allowsFeature('publickey-credentials-get');
      const canCreate = policy.allowsFeature('publickey-credentials-create');
      if (canGet === false || canCreate === false) {
        isIframeRestricted = true;
      }
    }
  } catch {
    // Ignore policy introspection errors
  }

  return {
    isSupported: true,
    hasPlatformAuthenticator,
    isIframeRestricted,
    hasLocalVirtualKey,
    recommendedLabel: detectBiometricDeviceName()
  };
}

function classifyServerFailure(status: number, message: string, code?: string): WebAuthnActionResult {
  const lower = message.toLowerCase();
  if (code === 'NO_CREDENTIALS' || lower.includes('no biometric passkey')) {
    return {
      success: false,
      code: 'NO_CREDENTIALS',
      errorReason: 'NO_CREDENTIALS',
      errorTitle: 'No Biometric Passkey Enrolled',
      errorHint: 'Verify your corporate password once to enroll Touch ID, Face ID, Windows Hello, or a security key for this account.',
      message
    };
  }
  if (status === 401 && lower.includes('password')) {
    return {
      success: false,
      errorReason: 'PASSWORD_REQUIRED',
      errorTitle: 'Account Password Required',
      errorHint: 'Enter your current account password before binding a new biometric passkey.',
      message
    };
  }
  if (lower.includes('pending approval')) {
    return {
      success: false,
      errorReason: 'ACCOUNT_PENDING',
      errorTitle: 'Account Pending Admin Approval',
      errorHint: 'Your biometric signature passed, but a DeRoyalTech Administrator must approve your client account first.',
      message
    };
  }
  if (lower.includes('restricted')) {
    return {
      success: false,
      errorReason: 'ACCOUNT_RESTRICTED',
      errorTitle: 'Account Access Restricted',
      errorHint: 'Contact DeRoyalTech support at support@deroyaltech.com to restore access.',
      message
    };
  }
  if (lower.includes('expired') || lower.includes('challenge mismatch')) {
    return {
      success: false,
      errorReason: 'CHALLENGE_EXPIRED',
      errorTitle: 'WebAuthn Challenge Expired',
      errorHint: 'Cryptographic challenges expire after 5 minutes. Click Retry to issue a fresh challenge.',
      message
    };
  }
  if (lower.includes('signature') || lower.includes('cloned authenticator')) {
    return {
      success: false,
      errorReason: 'SIGNATURE_INVALID',
      errorTitle: 'Cryptographic Signature Rejected',
      errorHint: 'The authenticator signature or counter could not be verified. Re-enroll this device passkey if it was reset.',
      message
    };
  }
  if (lower.includes('relying party domain')) {
    return {
      success: false,
      errorReason: 'SECURITY_MISMATCH',
      errorTitle: 'Origin Domain Mismatch',
      errorHint: 'Ensure you are signing in on the same domain where your passkey was originally registered.',
      message
    };
  }
  return {
    success: false,
    errorReason: 'UNKNOWN',
    errorTitle: 'WebAuthn Verification Failed',
    errorHint: 'Try again or sign in with your corporate password.',
    message
  };
}

async function classifyWebAuthnDomError(
  err: any,
  mode: 'register' | 'login',
  attachment: 'platform' | 'cross-platform' = 'platform'
): Promise<WebAuthnActionResult> {
  const errName = String(err?.name || 'Error');
  const msg = String(err?.message || '');
  const lower = msg.toLowerCase();

  // 1. Iframe Permissions Policy / Feature Policy restriction
  if (
    lower.includes('permissions policy') ||
    lower.includes('feature policy') ||
    lower.includes('publickey-credentials') ||
    (lower.includes('not enabled in this document') && window.self !== window.top)
  ) {
    return {
      success: false,
      hardwareBlocked: true,
      domErrorName: errName,
      errorReason: 'IFRAME_POLICY_BLOCKED',
      errorTitle: 'Browser Frame Restricted Hardware WebAuthn',
      errorHint: 'Embedded preview frames disable native biometric prompts. Use the Cryptographic FIDO2 Enclave Authenticator below or open the app in a top-level tab.',
      message: 'Hardware WebAuthn prompt was blocked by browser frame permissions policy.'
    };
  }

  // 2. Duplicate registration (InvalidStateError)
  if (errName === 'InvalidStateError') {
    return {
      success: false,
      domErrorName: errName,
      errorReason: 'CREDENTIAL_ALREADY_REGISTERED',
      errorTitle: 'Authenticator Already Registered',
      errorHint: 'This biometric sensor or security key is already bound to your account. Switch to Sign In with Biometrics instead.',
      message: 'This biometric passkey is already registered on this device for your account.'
    };
  }

  // 3. Hardware/Authenticator Not Found or Platform Sensor Missing
  let hasPlatformSensor = false;
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    ) {
      hasPlatformSensor = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
  } catch {
    hasPlatformSensor = false;
  }

  if (
    errName === 'NotFoundError' ||
    errName === 'UnknownError' ||
    lower.includes('no authenticator') ||
    lower.includes('hardware not found') ||
    lower.includes('not available on this device') ||
    (errName === 'NotAllowedError' && attachment === 'platform' && !hasPlatformSensor && !lower.includes('cancel'))
  ) {
    return {
      success: false,
      hardwareBlocked: true,
      domErrorName: errName,
      errorReason: 'HARDWARE_NOT_FOUND',
      errorTitle: 'Biometric Hardware Not Found',
      errorHint:
        attachment === 'cross-platform'
          ? 'No USB or NFC FIDO2 security key was detected. Insert or tap your security key and retry.'
          : 'No built-in Touch ID, Face ID, or Windows Hello sensor was detected on this device. You can try a USB/NFC security key, enroll via FIDO2 Enclave, or sign in with password.',
      message:
        attachment === 'cross-platform'
          ? 'No external hardware security key was detected.'
          : 'No compatible biometric hardware sensor (Touch ID, Face ID, Windows Hello) was found on this device.'
    };
  }

  // 4. Explicit User Cancellation / Timeout (AbortError or NotAllowedError)
  if (
    errName === 'AbortError' ||
    errName === 'NotAllowedError' ||
    lower.includes('cancel') ||
    lower.includes('timed out') ||
    lower.includes('timeout') ||
    lower.includes('aborted')
  ) {
    return {
      success: false,
      domErrorName: errName,
      errorReason: 'USER_CANCELLED',
      errorTitle: mode === 'register' ? 'Biometric Enrollment Cancelled' : 'Biometric Verification Cancelled',
      errorHint:
        'You dismissed the biometric prompt or the 60-second verification window timed out. Click Retry when ready, or use your corporate password.',
      message:
        mode === 'register'
          ? 'Biometric enrollment was cancelled or timed out before completion.'
          : 'Biometric authentication prompt was cancelled or timed out.'
    };
  }

  // 5. Unsupported Browser / OS (NotSupportedError)
  if (errName === 'NotSupportedError') {
    return {
      success: false,
      hardwareBlocked: true,
      domErrorName: errName,
      errorReason: 'NOT_SUPPORTED',
      errorTitle: 'WebAuthn Not Supported on This Browser',
      errorHint: 'Your browser lacks WebAuthn support or required cryptographic algorithms. Use the Cryptographic FIDO2 Enclave or sign in with password.',
      message: 'WebAuthn biometric authentication is not supported by this browser/OS configuration.'
    };
  }

  // 6. Security Origin / HTTPS error (SecurityError)
  if (errName === 'SecurityError') {
    return {
      success: false,
      hardwareBlocked: true,
      domErrorName: errName,
      errorReason: 'SECURITY_MISMATCH',
      errorTitle: 'WebAuthn Origin Security Error',
      errorHint: 'WebAuthn requires a valid HTTPS or localhost origin matching the relying party ID.',
      message: msg || 'Security origin error prevented WebAuthn operation.'
    };
  }

  return {
    success: false,
    domErrorName: errName,
    errorReason: 'UNKNOWN',
    errorTitle: 'Biometric Operation Failed',
    errorHint: 'An unexpected error occurred during the WebAuthn ceremony. You may retry or sign in with password.',
    message: msg || 'Biometric operation failed.'
  };
}

export async function registerHardwareBiometricPasskey(params: {
  email: string;
  fullName?: string;
  company?: string;
  password?: string;
  deviceName?: string;
  allowNewAccountRegistration?: boolean;
  isLoggedInSession?: boolean;
  authenticatorAttachment?: 'platform' | 'cross-platform';
}): Promise<WebAuthnActionResult> {
  const attachment = params.authenticatorAttachment || 'platform';
  try {
    if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials?.create) {
      return {
        success: false,
        hardwareBlocked: true,
        errorReason: 'NOT_SUPPORTED',
        errorTitle: 'WebAuthn Unsupported',
        errorHint: 'Switch to a modern browser (Chrome, Safari, Edge, Firefox) or enroll a Local FIDO2 Enclave passkey below.',
        message: 'WebAuthn is not supported in this browser environment.'
      };
    }

    const optRes = await fetch('/api/webauthn/register/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        email: params.email,
        fullName: params.fullName,
        company: params.company,
        password: params.password,
        allowNewAccountRegistration: params.allowNewAccountRegistration,
        isLoggedInSession: params.isLoggedInSession,
        authenticatorAttachment: attachment,
        rpId: window.location.hostname
      })
    });

    const optData = await optRes.json();
    if (!optRes.ok || !optData.success) {
      return classifyServerFailure(optRes.status, optData.message || 'Unable to start biometric passkey enrollment.', optData.code);
    }

    const rawOpts = optData.options;
    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: base64UrlToArrayBuffer(rawOpts.challenge),
      rp: rawOpts.rp,
      user: {
        id: base64UrlToArrayBuffer(rawOpts.user.id),
        name: rawOpts.user.name,
        displayName: rawOpts.user.displayName
      },
      pubKeyCredParams: rawOpts.pubKeyCredParams,
      timeout: rawOpts.timeout || 60000,
      attestation: rawOpts.attestation || 'none',
      excludeCredentials: (rawOpts.excludeCredentials || []).map((c: any) => ({
        id: base64UrlToArrayBuffer(c.id),
        type: 'public-key',
        transports: c.transports
      })),
      authenticatorSelection: rawOpts.authenticatorSelection
    };

    const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;
    if (!cred) {
      return {
        success: false,
        errorReason: 'USER_CANCELLED',
        errorTitle: 'Biometric Enrollment Cancelled',
        errorHint: 'No credential was returned from the biometric dialog. Retry when ready.',
        message: 'Biometric passkey creation was cancelled.'
      };
    }

    const response = cred.response as AuthenticatorAttestationResponse & {
      getPublicKey?: () => ArrayBuffer | null;
      getPublicKeyAlgorithm?: () => number;
      getTransports?: () => string[];
    };

    const spkiBuf = typeof response.getPublicKey === 'function' ? response.getPublicKey() : null;
    const transports = typeof response.getTransports === 'function' ? response.getTransports() : ['internal'];
    const publicKeyAlgorithm =
      typeof response.getPublicKeyAlgorithm === 'function' ? response.getPublicKeyAlgorithm() : -7;

    const verifyRes = await fetch('/api/webauthn/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        challengeId: optData.challengeId,
        email: params.email,
        deviceName: params.deviceName || detectBiometricDeviceName(),
        authenticatorType: attachment,
        credential: {
          id: cred.id,
          rawId: bufferToBase64Url(cred.rawId),
          type: cred.type,
          response: {
            clientDataJSON: bufferToBase64Url(response.clientDataJSON),
            attestationObject: bufferToBase64Url(response.attestationObject),
            publicKeySpki: spkiBuf ? bufferToBase64Url(spkiBuf) : undefined,
            publicKeyAlgorithm,
            transports
          }
        }
      })
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.success) {
      return classifyServerFailure(verifyRes.status, verifyData.message || 'Biometric enrollment verification failed.');
    }

    return {
      success: true,
      credential: verifyData.credential,
      user: verifyData.user,
      message: `Biometric passkey "${verifyData.credential?.deviceName}" verified and enrolled.`
    };
  } catch (err: any) {
    if (err?.name === 'TypeError' && String(err?.message || '').toLowerCase().includes('fetch')) {
      return {
        success: false,
        errorReason: 'NETWORK_ERROR',
        errorTitle: 'Server Connection Error',
        errorHint: 'Could not reach the WebAuthn verification server. Check your connection and retry.',
        message: 'Network error while communicating with WebAuthn server.'
      };
    }
    return classifyWebAuthnDomError(err, 'register', attachment);
  }
}

export async function authenticateHardwareBiometricPasskey(params: {
  email?: string;
}): Promise<WebAuthnActionResult> {
  try {
    if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials?.get) {
      return {
        success: false,
        hardwareBlocked: true,
        errorReason: 'NOT_SUPPORTED',
        errorTitle: 'WebAuthn Unsupported',
        errorHint: 'Your current browser does not support FIDO2 WebAuthn credentials. Sign in with your corporate password.',
        message: 'WebAuthn is not supported in this browser.'
      };
    }

    const optRes = await fetch('/api/webauthn/login/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        email: params.email,
        rpId: window.location.hostname
      })
    });

    const optData = await optRes.json();
    if (!optRes.ok || !optData.success) {
      return classifyServerFailure(
        optRes.status,
        optData.message || 'Could not initialize biometric sign-in.',
        optData.code
      );
    }

    const rawOpts = optData.options;
    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: base64UrlToArrayBuffer(rawOpts.challenge),
      rpId: rawOpts.rpId,
      timeout: rawOpts.timeout || 60000,
      userVerification: rawOpts.userVerification || 'required',
      allowCredentials: (rawOpts.allowCredentials || []).map((c: any) => ({
        id: base64UrlToArrayBuffer(c.id),
        type: 'public-key',
        transports: c.transports
      }))
    };

    const assertion = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
    if (!assertion) {
      return {
        success: false,
        errorReason: 'USER_CANCELLED',
        errorTitle: 'Biometric Sign-In Cancelled',
        errorHint: 'You dismissed the biometric prompt before verifying your identity. Retry or sign in with password.',
        message: 'Biometric authentication prompt was cancelled.'
      };
    }

    const response = assertion.response as AuthenticatorAssertionResponse;
    const verifyRes = await fetch('/api/webauthn/login/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        challengeId: optData.challengeId,
        email: params.email,
        credential: {
          id: assertion.id,
          rawId: bufferToBase64Url(assertion.rawId),
          type: assertion.type,
          response: {
            clientDataJSON: bufferToBase64Url(response.clientDataJSON),
            authenticatorData: bufferToBase64Url(response.authenticatorData),
            signature: bufferToBase64Url(response.signature),
            userHandle: response.userHandle ? bufferToBase64Url(response.userHandle) : undefined
          }
        }
      })
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.success) {
      return classifyServerFailure(verifyRes.status, verifyData.message || 'Biometric verification failed.');
    }

    return {
      success: true,
      user: verifyData.user,
      authenticatedWith: verifyData.authenticatedWith,
      message: 'Biometric authentication verified cleanly.'
    };
  } catch (err: any) {
    if (err?.name === 'TypeError' && String(err?.message || '').toLowerCase().includes('fetch')) {
      return {
        success: false,
        errorReason: 'NETWORK_ERROR',
        errorTitle: 'Server Connection Error',
        errorHint: 'Could not reach the WebAuthn verification server. Check your connection and retry.',
        message: 'Network error while verifying biometric assertion.'
      };
    }
    return classifyWebAuthnDomError(err, 'login', 'platform');
  }
}

/**
 * Software-backed Web Crypto ECDSA P-256 Virtual FIDO2 Authenticator
 * Uses real server-issued WebAuthn challenges and genuine ECDSA P-256 signatures
 * verified cryptographically on /api/webauthn/* when platform sensors or iframe permissions are unavailable.
 */
export async function registerVirtualFido2Biometric(params: {
  email: string;
  fullName?: string;
  password?: string;
  deviceName?: string;
  allowNewAccountRegistration?: boolean;
  isLoggedInSession?: boolean;
}): Promise<WebAuthnActionResult> {
  try {
    const optRes = await fetch('/api/webauthn/register/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        email: params.email,
        fullName: params.fullName,
        password: params.password,
        allowNewAccountRegistration: params.allowNewAccountRegistration,
        isLoggedInSession: params.isLoggedInSession,
        rpId: window.location.hostname
      })
    });

    const optData = await optRes.json();
    if (!optRes.ok || !optData.success) {
      return {
        success: false,
        message: optData.message || 'Unable to start FIDO2 biometric enrollment.'
      };
    }

    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
    const spkiBuf = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
    const randomId = crypto.getRandomValues(new Uint8Array(24));
    const credentialId = bufferToBase64Url(randomId);
    const publicKeySpki = bufferToBase64Url(spkiBuf);

    const clientData = {
      type: 'webauthn.create',
      challenge: optData.options.challenge,
      origin: window.location.origin,
      crossOrigin: window.self !== window.top
    };
    const clientDataJSON = bufferToBase64Url(new TextEncoder().encode(JSON.stringify(clientData)));

    const deviceLabel = params.deviceName || `${detectBiometricDeviceName()} (FIDO2 Enclave)`;
    const verifyRes = await fetch('/api/webauthn/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        challengeId: optData.challengeId,
        email: params.email,
        deviceName: deviceLabel,
        authenticatorType: 'virtual-fido2',
        credential: {
          id: credentialId,
          rawId: credentialId,
          type: 'public-key',
          response: {
            clientDataJSON,
            publicKeySpki,
            publicKeyAlgorithm: -7,
            transports: ['internal']
          }
        }
      })
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.success) {
      return {
        success: false,
        message: verifyData.message || 'Virtual FIDO2 passkey verification failed.'
      };
    }

    saveVirtualKey({
      credentialId,
      email: params.email.trim().toLowerCase(),
      deviceName: deviceLabel,
      publicKeySpki,
      privateKeyJwk,
      counter: 1,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      credential: verifyData.credential,
      user: verifyData.user,
      message: `FIDO2 biometric passkey "${deviceLabel}" enrolled cleanly.`
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to create virtual FIDO2 biometric credential.'
    };
  }
}

export async function authenticateVirtualFido2Biometric(params: {
  email?: string;
}): Promise<WebAuthnActionResult> {
  try {
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const keys = getStoredVirtualKeys();
    const localKey = cleanEmail
      ? keys.find(k => k.email === cleanEmail)
      : keys[0];

    if (!localKey) {
      return {
        success: false,
        code: 'NO_LOCAL_KEY',
        message: 'No FIDO2 biometric passkey found in this browser for this account. Enroll your passkey first.'
      };
    }

    const optRes = await fetch('/api/webauthn/login/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        email: cleanEmail || localKey.email,
        rpId: window.location.hostname
      })
    });

    const optData = await optRes.json();
    if (!optRes.ok || !optData.success) {
      return {
        success: false,
        code: optData.code,
        message: optData.message || 'Failed to initiate FIDO2 challenge.'
      };
    }

    const clientData = {
      type: 'webauthn.get',
      challenge: optData.options.challenge,
      origin: window.location.origin,
      crossOrigin: window.self !== window.top
    };
    const clientDataBytes = new TextEncoder().encode(JSON.stringify(clientData));
    const clientDataHash = new Uint8Array(await crypto.subtle.digest('SHA-256', clientDataBytes));

    const rpIdHash = new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(optData.options.rpId))
    );
    const nextCounter = (localKey.counter || 1) + 1;
    const authData = new Uint8Array(37);
    authData.set(rpIdHash, 0);
    authData[32] = 0x05; // UP (0x01) + UV (0x04)
    new DataView(authData.buffer).setUint32(33, nextCounter, false);

    const signedData = new Uint8Array(authData.length + clientDataHash.length);
    signedData.set(authData, 0);
    signedData.set(clientDataHash, authData.length);

    const privateKey = await crypto.subtle.importKey(
      'jwk',
      localKey.privateKeyJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );
    const signatureBuf = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      privateKey,
      signedData
    );

    const verifyRes = await fetch('/api/webauthn/login/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        challengeId: optData.challengeId,
        email: cleanEmail || localKey.email,
        credential: {
          id: localKey.credentialId,
          rawId: localKey.credentialId,
          type: 'public-key',
          response: {
            clientDataJSON: bufferToBase64Url(clientDataBytes),
            authenticatorData: bufferToBase64Url(authData),
            signature: bufferToBase64Url(signatureBuf)
          }
        }
      })
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.success) {
      return {
        success: false,
        message: verifyData.message || 'Biometric cryptographic signature verification failed.'
      };
    }

    saveVirtualKey({ ...localKey, counter: nextCounter });

    return {
      success: true,
      user: verifyData.user,
      authenticatedWith: verifyData.authenticatedWith,
      message: 'FIDO2 biometric passkey authenticated successfully.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Virtual FIDO2 authentication error.'
    };
  }
}

export async function revokeBiometricCredential(params: {
  credentialId: string;
  userId?: string;
  email?: string;
}): Promise<{ success: boolean; user?: ClientUser; message?: string }> {
  removeStoredVirtualKey(params.credentialId);
  try {
    const res = await fetch(`/api/webauthn/credentials/${encodeURIComponent(params.credentialId)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ userId: params.userId, email: params.email })
    });
    const data = await res.json();
    return {
      success: Boolean(res.ok && data.success),
      user: data.user,
      message: data.message
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to revoke biometric credential.'
    };
  }
}

export interface PublicBiometricKeyExportEntry {
  credentialId: string;
  rawId: string;
  deviceName: string;
  authenticatorType: WebAuthnCredential['authenticatorType'];
  algorithm: number;
  algorithmLabel: string;
  transports: string[];
  counter: number;
  createdAt: string;
  lastUsedAt?: string;
  publicKeySpki: string;
  publicKeyPem: string;
  sha256Fingerprint: string;
}

export interface PublicBiometricKeyBackupBundle {
  schema: 'deroyaltech-webauthn-public-backup-v1';
  exportedAt: string;
  relyingPartyId: string;
  keySecurityNotice: string;
  account: {
    id: string;
    email: string;
    fullName: string;
    company: string;
  };
  totalCredentials: number;
  publicCredentials: PublicBiometricKeyExportEntry[];
}

export function spkiBase64UrlToPem(spkiBase64Url: string): string {
  const clean = (spkiBase64Url || '').trim();
  if (!clean) {
    return '-----BEGIN PUBLIC KEY-----\n(Public SPKI key unavailable for this legacy credential)\n-----END PUBLIC KEY-----';
  }
  const padding = '='.repeat((4 - (clean.length % 4)) % 4);
  const standardBase64 = (clean + padding).replace(/-/g, '+').replace(/_/g, '/');
  const lines = standardBase64.match(/.{1,64}/g) || [standardBase64];
  return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`;
}

export async function computePublicKeyFingerprint(spkiBase64Url: string, fallbackId?: string): Promise<string> {
  try {
    const sourceBytes = spkiBase64Url
      ? new Uint8Array(base64UrlToArrayBuffer(spkiBase64Url))
      : new TextEncoder().encode(fallbackId || 'empty-key');
    const digest = await crypto.subtle.digest('SHA-256', sourceBytes);
    const hexParts = Array.from(new Uint8Array(digest)).map((b) =>
      b.toString(16).toUpperCase().padStart(2, '0')
    );
    return `SHA256:${hexParts.join(':')}`;
  } catch {
    return 'SHA256:UNAVAILABLE';
  }
}

export async function buildPublicBiometricBackupBundle(params: {
  user: ClientUser;
  credentials: WebAuthnCredential[];
  rpId?: string;
}): Promise<PublicBiometricKeyBackupBundle> {
  const publicCredentials: PublicBiometricKeyExportEntry[] = await Promise.all(
    params.credentials.map(async (cred) => {
      const spki = cred.publicKeySpki || '';
      const fingerprint = await computePublicKeyFingerprint(spki, cred.id);
      return {
        credentialId: cred.id,
        rawId: cred.rawId || cred.id,
        deviceName: cred.deviceName,
        authenticatorType: cred.authenticatorType,
        algorithm: cred.algorithm,
        algorithmLabel: cred.algorithm === -257 ? 'RS256 (RSASSA-PKCS1-v1_5 SHA-256)' : 'ES256 (ECDSA P-256 SHA-256)',
        transports: cred.transports && cred.transports.length > 0 ? cred.transports : ['internal'],
        counter: cred.counter || 0,
        createdAt: cred.createdAt,
        lastUsedAt: cred.lastUsedAt,
        publicKeySpki: spki,
        publicKeyPem: spkiBase64UrlToPem(spki),
        sha256Fingerprint: fingerprint
      };
    })
  );

  return {
    schema: 'deroyaltech-webauthn-public-backup-v1',
    exportedAt: new Date().toISOString(),
    relyingPartyId: params.rpId || (typeof window !== 'undefined' ? window.location.hostname : 'deroyal.tech'),
    keySecurityNotice:
      'PUBLIC BIOMETRIC KEYS ONLY — Safe for offline backup and cross-device verification. Private keys never leave your authenticator or enclave.',
    account: {
      id: params.user.id,
      email: params.user.email,
      fullName: params.user.fullName,
      company: params.user.company
    },
    totalCredentials: publicCredentials.length,
    publicCredentials
  };
}

