import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Lock,
  UserPlus,
  LogIn,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  User,
  Key,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  Fingerprint,
  Smartphone,
  Laptop,
  Trash2,
  KeyRound,
  ScanFace,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import {
  checkWebAuthnCapabilities,
  registerHardwareBiometricPasskey,
  authenticateHardwareBiometricPasskey,
  registerVirtualFido2Biometric,
  authenticateVirtualFido2Biometric,
  revokeBiometricCredential,
  detectBiometricDeviceName,
  WebAuthnCapabilities,
  WebAuthnActionResult
} from '../utils/webauthn.ts';
import { WebAuthnCredential } from '../types/index.ts';
import {
  WebAuthnStatusBanner,
  WebAuthnFeedbackState
} from './common/WebAuthnStatusBanner.tsx';

export const ClientAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    registerClient,
    loginClient,
    completeBiometricLogin,
    attachBiometricCredential,
    removeBiometricCredential,
    registeredUsers,
    clientUser,
    authRedirectTarget
  } = useSite();

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    role: 'Procurement & Systems Lead',
    password: '',
    confirmPassword: ''
  });
  const [enrollBiometricOnRegister, setEnrollBiometricOnRegister] = useState(true);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authFeedback, setAuthFeedback] = useState<{
    type: 'error' | 'pending' | 'success';
    message: string;
  } | null>(null);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [registeredWithBiometric, setRegisteredWithBiometric] = useState(false);

  // WebAuthn state
  const [capabilities, setCapabilities] = useState<WebAuthnCapabilities | null>(null);
  const [isBiometricBusy, setIsBiometricBusy] = useState(false);
  const [webAuthnFeedback, setWebAuthnFeedback] = useState<WebAuthnFeedbackState | null>(null);
  const [lastAttachmentAttempt, setLastAttachmentAttempt] = useState<'platform' | 'cross-platform'>('platform');
  const [showEnrollPanel, setShowEnrollPanel] = useState(false);
  const [enrollDeviceName, setEnrollDeviceName] = useState(() => detectBiometricDeviceName());
  const [virtualPromptOpen, setVirtualPromptOpen] = useState<'login' | 'enroll' | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const targetEmailForLookup = useMemo(() => {
    if (authModalTab === 'security' && clientUser) return clientUser.email;
    if (authModalTab === 'login') return loginForm.email.trim().toLowerCase();
    return registerForm.email.trim().toLowerCase();
  }, [authModalTab, clientUser, loginForm.email, registerForm.email]);

  const matchedAccountForEmail = useMemo(() => {
    if (!targetEmailForLookup) return undefined;
    return registeredUsers.find(u => u.email.toLowerCase() === targetEmailForLookup);
  }, [registeredUsers, targetEmailForLookup]);

  const enrolledPasskeyCount = matchedAccountForEmail?.webAuthnCredentials?.length || 0;

  useEffect(() => {
    if (!isAuthModalOpen) return;
    let mounted = true;
    checkWebAuthnCapabilities(targetEmailForLookup).then(caps => {
      if (mounted) setCapabilities(caps);
    });
    return () => {
      mounted = false;
    };
  }, [isAuthModalOpen, targetEmailForLookup, enrolledPasskeyCount]);

  if (!isAuthModalOpen) return null;

  const getPageTitle = (page: string | null) => {
    switch (page) {
      case 'services':
        return 'Engineering Services & Architecture';
      case 'workflow':
        return 'Hardware-to-Cloud Integration Hub';
      case 'projects':
        return 'Completed Projects & MP4 Video Overviews';
      case 'hardware':
        return 'Hardware Peripherals & Workstations Catalog';
      case 'estimator':
        return 'Solution Scope & Pricing Estimator';
      case 'contact':
        return 'Ghana Office & Consultation';
      default:
        return 'Enterprise Client Portal';
    }
  };

  const resetModalState = () => {
    setRegistrationSubmitted(false);
    setRegisteredWithBiometric(false);
    setAuthFeedback(null);
    setWebAuthnFeedback(null);
    setVirtualPromptOpen(null);
    setIsBiometricBusy(false);
  };

  const applyBiometricErrorFeedback = (
    res: WebAuthnActionResult,
    mode: 'login' | 'enroll'
  ) => {
    setWebAuthnFeedback({
      status: 'error',
      mode,
      title: res.errorTitle || (mode === 'enroll' ? 'Biometric Enrollment Failed' : 'Biometric Verification Failed'),
      message: res.message || 'Could not complete WebAuthn verification.',
      hint: res.errorHint,
      errorReason: res.errorReason || 'UNKNOWN',
      domErrorName: res.domErrorName,
      hardwareBlocked: res.hardwareBlocked
    });
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    resetModalState();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    setWebAuthnFeedback(null);
    const newErrors: { [key: string]: string } = {};

    if (!registerForm.fullName.trim() || registerForm.fullName.trim().length < 3) {
      newErrors.fullName = 'Full legal name must be at least 3 characters.';
    }
    if (!registerForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      newErrors.email = 'Valid corporate email address is required.';
    }
    if (!registerForm.company.trim() || registerForm.company.trim().length < 2) {
      newErrors.company = 'Registered company/organization name is required.';
    }
    if (!registerForm.phone.trim() || registerForm.phone.trim().length < 7) {
      newErrors.phone = 'Valid phone number with country code is required.';
    }
    if (!registerForm.password || registerForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    let boundCredentials: WebAuthnCredential[] = [];
    if (enrollBiometricOnRegister) {
      setIsBiometricBusy(true);
      setWebAuthnFeedback({
        status: 'scanning',
        mode: 'enroll',
        title: 'Binding Biometric Passkey',
        message: 'Prompting Touch ID, Face ID, Windows Hello, or FIDO2 authenticator...'
      });
      let bioRes = await registerHardwareBiometricPasskey({
        email: registerForm.email.trim().toLowerCase(),
        fullName: registerForm.fullName.trim(),
        company: registerForm.company.trim(),
        deviceName: detectBiometricDeviceName(),
        allowNewAccountRegistration: true
      });

      if (!bioRes.success && bioRes.errorReason === 'IFRAME_POLICY_BLOCKED') {
        setWebAuthnFeedback({
          status: 'scanning',
          mode: 'enroll',
          title: 'Binding FIDO2 Enclave Key',
          message: 'Embedded frame blocked hardware prompt; signing via Web Crypto ECDSA P-256 enclave...'
        });
        bioRes = await registerVirtualFido2Biometric({
          email: registerForm.email.trim().toLowerCase(),
          fullName: registerForm.fullName.trim(),
          deviceName: `${detectBiometricDeviceName()} (FIDO2 Enclave)`,
          allowNewAccountRegistration: true
        });
      }

      setIsBiometricBusy(false);

      if (bioRes.success && bioRes.credential) {
        boundCredentials = [bioRes.credential];
        setRegisteredWithBiometric(true);
        setWebAuthnFeedback(null);
      } else if (!bioRes.success) {
        applyBiometricErrorFeedback(bioRes, 'enroll');
      }
    }

    const res = registerClient({
      fullName: registerForm.fullName,
      email: registerForm.email,
      company: registerForm.company,
      phone: registerForm.phone,
      role: registerForm.role,
      password: registerForm.password,
      webAuthnCredentials: boundCredentials
    });

    if (res.success) {
      setRegistrationSubmitted(true);
      setAuthFeedback({
        type: 'pending',
        message: res.message || 'Registration submitted. Account pending admin approval.'
      });
    } else {
      setAuthFeedback({
        type: 'error',
        message: res.message || 'Registration failed. Please check your details.'
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    setWebAuthnFeedback(null);
    const newErrors: { [key: string]: string } = {};

    if (!loginForm.email.trim()) newErrors.email = 'Email address is required.';
    if (!loginForm.password.trim()) newErrors.password = 'Password is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const res = loginClient(loginForm.email, loginForm.password);

    if (!res.success) {
      setAuthFeedback({
        type: 'error',
        message: res.message || 'Authentication failed.'
      });
    }
  };

  const handleBiometricSignIn = async () => {
    setAuthFeedback(null);
    setLastAttachmentAttempt('platform');
    setIsBiometricBusy(true);
    setWebAuthnFeedback({
      status: 'scanning',
      mode: 'login',
      title: 'Awaiting Biometric Verification',
      message: 'Verify Touch ID, Face ID, Windows Hello, or tap your hardware security key (60s timeout)...'
    });

    const cleanEmail = loginForm.email.trim().toLowerCase() || undefined;
    const res = await authenticateHardwareBiometricPasskey({ email: cleanEmail });

    setIsBiometricBusy(false);

    if (res.success && res.user) {
      setWebAuthnFeedback({
        status: 'success',
        mode: 'login',
        title: 'Biometric Signature Verified',
        message: `Authenticated as ${res.user.fullName} using ${res.authenticatedWith?.deviceName || 'Biometric Passkey'}.`
      });
      const loginRes = completeBiometricLogin(res.user);
      if (!loginRes.success) {
        setWebAuthnFeedback(null);
        setAuthFeedback({
          type: 'error',
          message: loginRes.message || 'Could not complete portal session.'
        });
      }
      return;
    }

    if (res.errorReason === 'NO_CREDENTIALS' || res.code === 'NO_CREDENTIALS') {
      setShowEnrollPanel(true);
    }

    applyBiometricErrorFeedback(res, 'login');
  };

  const handleEnrollBiometric = async (attachment: 'platform' | 'cross-platform' = 'platform') => {
    setAuthFeedback(null);
    setLastAttachmentAttempt(attachment);

    const targetEmail =
      authModalTab === 'security' && clientUser
        ? clientUser.email
        : loginForm.email.trim().toLowerCase();
    const targetPassword = loginForm.password;

    if (!targetEmail) {
      setWebAuthnFeedback({
        status: 'error',
        mode: 'enroll',
        title: 'Corporate Email Required',
        message: 'Enter your corporate email address first to enroll a biometric passkey.',
        errorReason: 'UNKNOWN',
        hint: 'Provide the approved email address associated with your DeRoyalTech partner account.'
      });
      return;
    }

    if (authModalTab !== 'security' && !targetPassword) {
      setShowEnrollPanel(true);
      setWebAuthnFeedback({
        status: 'error',
        mode: 'enroll',
        title: 'Account Password Required',
        message: 'Enter your current account password below to authorize binding a biometric passkey.',
        errorReason: 'PASSWORD_REQUIRED',
        hint: 'Password verification ensures only the account owner can attach new biometric devices.'
      });
      return;
    }

    setIsBiometricBusy(true);
    setWebAuthnFeedback({
      status: 'scanning',
      mode: 'enroll',
      title:
        attachment === 'cross-platform'
          ? 'Waiting for USB / NFC Security Key'
          : 'Waiting for Biometric Sensor',
      message:
        attachment === 'cross-platform'
          ? 'Insert or tap your external FIDO2 hardware key when prompted by your browser...'
          : 'Confirm with Touch ID, Face ID, or Windows Hello to bind this device...'
    });

    const res = await registerHardwareBiometricPasskey({
      email: targetEmail,
      password: targetPassword,
      deviceName: enrollDeviceName.trim() || detectBiometricDeviceName(),
      isLoggedInSession: authModalTab === 'security' && Boolean(clientUser),
      authenticatorAttachment: attachment
    });

    setIsBiometricBusy(false);

    if (res.success && res.credential) {
      attachBiometricCredential(targetEmail, res.credential);
      setShowEnrollPanel(false);
      setWebAuthnFeedback({
        status: 'success',
        mode: 'enroll',
        title: 'Biometric Passkey Enrolled',
        message:
          res.message ||
          'Passkey stored securely. You can now sign in immediately without typing a password.'
      });
      return;
    }

    applyBiometricErrorFeedback(res, 'enroll');
  };

  const handleVirtualBiometricConfirm = async () => {
    const mode = virtualPromptOpen;
    if (!mode) return;
    setVirtualPromptOpen(null);
    setAuthFeedback(null);
    setIsBiometricBusy(true);
    setWebAuthnFeedback({
      status: 'scanning',
      mode,
      title: 'Signing WebAuthn FIDO2 Challenge',
      message: 'Generating ECDSA P-256 signature over server challenge and relying party hash...'
    });

    const targetEmail =
      authModalTab === 'security' && clientUser
        ? clientUser.email
        : loginForm.email.trim().toLowerCase();

    if (mode === 'enroll') {
      const res = await registerVirtualFido2Biometric({
        email: targetEmail,
        password: loginForm.password,
        deviceName: `${enrollDeviceName.trim() || detectBiometricDeviceName()} (FIDO2 Enclave)`,
        isLoggedInSession: authModalTab === 'security' && Boolean(clientUser)
      });
      setIsBiometricBusy(false);
      if (res.success && res.credential) {
        attachBiometricCredential(targetEmail, res.credential);
        setShowEnrollPanel(false);
        setWebAuthnFeedback({
          status: 'success',
          mode: 'enroll',
          title: 'FIDO2 Enclave Passkey Enrolled',
          message:
            res.message ||
            'ECDSA P-256 credential registered cleanly and verified on the backend.'
        });
      } else {
        applyBiometricErrorFeedback(res, 'enroll');
      }
      return;
    }

    const authRes = await authenticateVirtualFido2Biometric({ email: targetEmail || undefined });
    setIsBiometricBusy(false);

    if (authRes.success && authRes.user) {
      setWebAuthnFeedback({
        status: 'success',
        mode: 'login',
        title: 'FIDO2 Enclave Verified',
        message: `Signed in as ${authRes.user.fullName}.`
      });
      const finalRes = completeBiometricLogin(authRes.user);
      if (!finalRes.success) {
        setWebAuthnFeedback(null);
        setAuthFeedback({
          type: 'error',
          message: finalRes.message || 'Could not sign in with FIDO2 passkey.'
        });
      }
    } else {
      if (authRes.code === 'NO_LOCAL_KEY' || authRes.code === 'NO_CREDENTIALS') {
        setShowEnrollPanel(true);
      }
      applyBiometricErrorFeedback(authRes, 'login');
    }
  };

  const handleRevokeCredential = async (credentialId: string) => {
    if (!clientUser) return;
    setIsBiometricBusy(true);
    setWebAuthnFeedback({
      status: 'scanning',
      mode: 'revoke',
      title: 'Revoking Biometric Passkey',
      message: 'Removing registered public key credential from your client account...'
    });
    const res = await revokeBiometricCredential({
      credentialId,
      userId: clientUser.id,
      email: clientUser.email
    });
    setIsBiometricBusy(false);
    removeBiometricCredential(clientUser.id, credentialId);
    setWebAuthnFeedback(
      res.success
        ? {
            status: 'success',
            mode: 'revoke',
            title: 'Passkey Revoked',
            message: 'Biometric credential was permanently removed from your account.'
          }
        : {
            status: 'error',
            mode: 'revoke',
            title: 'Revocation Error',
            message: res.message || 'Could not revoke passkey cleanly.',
            errorReason: 'UNKNOWN'
          }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-auth-modal-title"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white relative border-b border-slate-800">
          <button
            onClick={handleClose}
            aria-label="Close authentication modal"
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              {authModalTab === 'security' ? (
                <Fingerprint className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                DeRoyalTech Enterprise Gateway · WebAuthn FIDO2
              </span>
              <h2 id="client-auth-modal-title" className="text-lg font-bold">
                {authModalTab === 'security'
                  ? 'Biometric Passkeys & Security'
                  : authModalTab === 'register'
                  ? 'Enterprise Client Registration'
                  : 'Client Partner Sign In'}
              </h2>
            </div>
          </div>

          {authRedirectTarget && (
            <div className="mt-3 p-2.5 bg-blue-950/60 border border-blue-800/80 rounded-lg text-xs text-blue-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                To access <strong>{getPageTitle(authRedirectTarget)}</strong>, an approved client account is required.
              </span>
            </div>
          )}
        </div>

        {/* Interactive Virtual Biometric Sensor Confirmation Overlay */}
        {virtualPromptOpen && (
          <div className="p-6 bg-slate-950/95 border-b border-blue-500/40 text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/50 flex items-center justify-center text-blue-400 animate-pulse">
                <ScanFace className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  FIDO2 Cryptographic Enclave Challenge
                </div>
                <h3 className="text-sm font-bold text-white">
                  {virtualPromptOpen === 'enroll'
                    ? 'Authorize New Biometric Passkey Creation'
                    : 'Verify Biometric Signature to Unlock Portal'}
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This signs a live server challenge with an ECDSA P-256 private key bound to{' '}
              <span className="font-mono text-cyan-300">{window.location.hostname}</span> and verifies it on the DeRoyalTech backend.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVirtualBiometricConfirm}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg"
              >
                <Fingerprint className="w-4 h-4" />
                <span>
                  {virtualPromptOpen === 'enroll' ? 'Confirm & Create FIDO2 Key' : 'Confirm Biometric Verification'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setVirtualPromptOpen(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {registrationSubmitted ? (
          /* Registration Pending Approval State */
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Registration Submitted · Pending Admin Approval
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                Thank you for applying for a DeRoyalTech Enterprise Partner account. To protect sensitive hardware inventory pricing and client architectural intellectual property, <strong>verified badges and full page access are granted only after review by our systems administrator</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5 font-mono">
              <div className="text-slate-500">
                Applicant: <span className="text-slate-900 dark:text-white font-bold">{registerForm.fullName}</span>
              </div>
              <div className="text-slate-500">
                Company: <span className="text-slate-900 dark:text-white">{registerForm.company}</span>
              </div>
              <div className="text-slate-500">
                Verification Status:{' '}
                <span className="text-amber-600 dark:text-amber-400 font-bold">Pending Review</span>
              </div>
              {registeredWithBiometric && (
                <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1 font-sans font-semibold">
                  <Fingerprint className="w-4 h-4 shrink-0" />
                  <span>Biometric Passkey bound & ready upon admin approval</span>
                </div>
              )}
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Close and Return to Homepage
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tab Switcher */}
            {authModalTab !== 'security' ? (
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('register');
                    setAuthFeedback(null);
                    setWebAuthnFeedback(null);
                  }}
                  className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    authModalTab === 'register'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New Client Registration</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setAuthFeedback(null);
                    setWebAuthnFeedback(null);
                  }}
                  className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    authModalTab === 'login'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In to Approved Account</span>
                </button>
              </div>
            ) : (
              <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Signed in as {clientUser?.email}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {(clientUser?.webAuthnCredentials || []).length} passkey(s)
                </span>
              </div>
            )}

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Explicit Visual WebAuthn State & Error Handling Panel */}
              <WebAuthnStatusBanner
                feedback={webAuthnFeedback}
                onDismiss={() => {
                  setWebAuthnFeedback(null);
                  setIsBiometricBusy(false);
                }}
                onRetry={() => {
                  if (webAuthnFeedback?.mode === 'enroll') {
                    handleEnrollBiometric(lastAttachmentAttempt);
                  } else {
                    handleBiometricSignIn();
                  }
                }}
                onOpenEnroll={() => {
                  setWebAuthnFeedback(null);
                  setShowEnrollPanel(true);
                }}
                onUseVirtualFido2={() =>
                  setVirtualPromptOpen(webAuthnFeedback?.mode === 'enroll' ? 'enroll' : 'login')
                }
                onFocusPassword={
                  authModalTab === 'login'
                    ? () => {
                        setWebAuthnFeedback(null);
                        passwordInputRef.current?.focus();
                      }
                    : undefined
                }
              />

              {/* Standard Form Feedback Alert */}
              {authFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                    authFeedback.type === 'error'
                      ? 'bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                      : authFeedback.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {authFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{authFeedback.message}</span>
                </div>
              )}

              {/* Registration Form */}
              {authModalTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-0.5">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Corporate Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          placeholder="k.mensah@company.com"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Contact *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          placeholder="+233 24 590 1284"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-red-500 mt-0.5">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company or Organization *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={registerForm.company}
                          onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                          placeholder="e.g. West Africa Shippers Council"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      {errors.company && <p className="text-[11px] text-red-500 mt-0.5">{errors.company}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Business Role / Title
                      </label>
                      <input
                        type="text"
                        value={registerForm.role}
                        onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                        placeholder="e.g. Chief Technology Officer"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Create Password (min 6 chars) *
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      {errors.password && <p className="text-[11px] text-red-500 mt-0.5">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[11px] text-red-500 mt-0.5">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* WebAuthn Biometric Binding Toggle during Registration */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={enrollBiometricOnRegister}
                      onChange={(e) => setEnrollBiometricOnRegister(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Bind Biometric Passkey (WebAuthn FIDO2)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Automatically enroll Touch ID, Face ID, Windows Hello, or FIDO2 security key during registration for passwordless login after approval.
                      </p>
                    </div>
                  </label>

                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      Notice: All registrations undergo administrative review before verified badges are issued and access to restricted client pages is activated.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isBiometricBusy}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    <span>Submit Partner Registration for Approval</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Login Form + WebAuthn Biometric Authentication */}
              {authModalTab === 'login' && (
                <div className="space-y-4">
                  {/* Primary Biometric / Passkey Gateway Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-slate-800 text-white space-y-3 shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                          <Fingerprint className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>Biometric Passkey Sign In</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              FIDO2 / WebAuthn
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            {capabilities?.hasPlatformAuthenticator
                              ? `${capabilities.recommendedLabel} ready for passwordless verification`
                              : 'Supports Touch ID, Face ID, Windows Hello & hardware security keys'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {targetEmailForLookup && matchedAccountForEmail && (
                      <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
                        <span className="text-slate-300 truncate max-w-[230px]">
                          Account: <strong className="text-white">{matchedAccountForEmail.email}</strong>
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            enrolledPasskeyCount > 0 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {enrolledPasskeyCount > 0
                            ? `${enrolledPasskeyCount} Passkey Active`
                            : 'No Passkey Yet'}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        disabled={isBiometricBusy}
                        onClick={handleBiometricSignIn}
                        className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow flex items-center justify-center gap-2 transition-all"
                      >
                        <Fingerprint className="w-4 h-4" />
                        <span>Sign In with Biometrics / Passkey</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowEnrollPanel(prev => !prev);
                          setAuthFeedback(null);
                        }}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{showEnrollPanel ? 'Hide Setup' : 'Enroll Device'}</span>
                      </button>
                    </div>

                    {capabilities?.hasLocalVirtualKey && (
                      <button
                        type="button"
                        disabled={isBiometricBusy}
                        onClick={() => setVirtualPromptOpen('login')}
                        className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ScanFace className="w-3.5 h-3.5" />
                        <span>Quick Verify with Local FIDO2 Enclave Key</span>
                      </button>
                    )}

                    {/* Collapsible Inline Biometric Enrollment Drawer */}
                    {showEnrollPanel && (
                      <div className="pt-3 border-t border-slate-800 space-y-2.5">
                        <div className="text-[11px] text-slate-300 leading-relaxed">
                          Enter your corporate email & password below, name this device, and click{' '}
                          <strong className="text-white">Bind Device Biometrics</strong> to enable instant passwordless login next time.
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Trusted Device Label
                          </label>
                          <input
                            type="text"
                            value={enrollDeviceName}
                            onChange={(e) => setEnrollDeviceName(e.target.value)}
                            placeholder="e.g. Executive MacBook Pro Touch ID"
                            className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={isBiometricBusy}
                            onClick={() => handleEnrollBiometric('platform')}
                            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Fingerprint className="w-3.5 h-3.5" />
                            <span>Bind Platform Biometrics</span>
                          </button>
                          <button
                            type="button"
                            disabled={isBiometricBusy}
                            onClick={() => handleEnrollBiometric('cross-platform')}
                            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 disabled:opacity-60 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                            <span>Bind USB / NFC Key</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center py-0.5">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                    <span className="shrink mx-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Or authenticate with corporate password
                    </span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                  </div>

                  {/* Standard Email + Password Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Corporate Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          placeholder="e.g. k.asante@ghana-enterprises.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          ref={passwordInputRef}
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[11px] text-red-500 mt-0.5">{errors.password}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In with Password</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Logged-in Biometric Passkey Manager View */}
              {authModalTab === 'security' && clientUser && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Fingerprint className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Enroll New Biometric Passkey</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Register Touch ID, Face ID, Windows Hello, or a hardware security key to this device.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Device Passkey Label
                      </label>
                      <input
                        type="text"
                        value={enrollDeviceName}
                        onChange={(e) => setEnrollDeviceName(e.target.value)}
                        placeholder="e.g. Accra HQ Laptop Touch ID"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isBiometricBusy}
                        onClick={() => handleEnrollBiometric('platform')}
                        className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Enroll This Device Biometrics</span>
                      </button>
                      <button
                        type="button"
                        disabled={isBiometricBusy}
                        onClick={() => handleEnrollBiometric('cross-platform')}
                        className="py-2.5 px-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>Enroll Hardware Security Key</span>
                      </button>
                    </div>
                  </div>

                  {/* Registered Credentials List */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Registered Biometric Credentials</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {(clientUser.webAuthnCredentials || []).length} total
                      </span>
                    </div>

                    {(clientUser.webAuthnCredentials || []).length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                        No biometric passkeys enrolled on your account yet. Enroll your current device above for instant passwordless sign-in.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(clientUser.webAuthnCredentials || []).map((cred) => (
                          <div
                            key={cred.id}
                            className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                {cred.authenticatorType === 'cross-platform' ? (
                                  <KeyRound className="w-4 h-4" />
                                ) : cred.deviceName.toLowerCase().includes('phone') ? (
                                  <Smartphone className="w-4 h-4" />
                                ) : (
                                  <Laptop className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {cred.deviceName}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 truncate">
                                  Added {new Date(cred.createdAt).toLocaleDateString()} · Sign-ins: {cred.counter || 0}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={isBiometricBusy}
                              onClick={() => handleRevokeCredential(cred.id)}
                              title="Revoke Passkey"
                              aria-label={`Revoke passkey ${cred.deviceName}`}
                              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
