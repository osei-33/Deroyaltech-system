import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  KeyRound,
  Laptop,
  Smartphone,
  Cpu,
  Trash2,
  ScanFace,
  Lock,
  LogIn,
  UserPlus,
  Plus,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
  Activity,
  Clock
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
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
} from '../../utils/webauthn.ts';
import {
  WebAuthnStatusBanner,
  WebAuthnFeedbackState
} from '../common/WebAuthnStatusBanner.tsx';

export const ClientSecurityDashboard: React.FC = () => {
  const {
    clientUser,
    setIsAuthModalOpen,
    setAuthModalTab,
    attachBiometricCredential,
    removeBiometricCredential,
    completeBiometricLogin
  } = useSite();

  const [capabilities, setCapabilities] = useState<WebAuthnCapabilities | null>(null);
  const [deviceLabel, setDeviceLabel] = useState(() => detectBiometricDeviceName());
  const [isBusy, setIsBusy] = useState(false);
  const [lastAttachment, setLastAttachment] = useState<'platform' | 'cross-platform'>('platform');
  const [feedback, setFeedback] = useState<WebAuthnFeedbackState | null>(null);
  const [showEnclaveConfirm, setShowEnclaveConfirm] = useState(false);

  const credentials = clientUser?.webAuthnCredentials || [];

  const refreshDiagnostics = async () => {
    const caps = await checkWebAuthnCapabilities(clientUser?.email);
    setCapabilities(caps);
  };

  useEffect(() => {
    let mounted = true;
    checkWebAuthnCapabilities(clientUser?.email).then((caps) => {
      if (mounted) setCapabilities(caps);
    });
    return () => {
      mounted = false;
    };
  }, [clientUser?.email, credentials.length]);

  const reportFailure = (res: WebAuthnActionResult, mode: 'login' | 'enroll') => {
    setFeedback({
      status: 'error',
      mode,
      title: res.errorTitle || (mode === 'enroll' ? 'Biometric Registration Failed' : 'Biometric Test Failed'),
      message: res.message || 'WebAuthn operation could not be completed.',
      hint: res.errorHint,
      errorReason: res.errorReason || 'UNKNOWN',
      domErrorName: res.domErrorName,
      hardwareBlocked: res.hardwareBlocked
    });
  };

  const handleRegisterBiometric = async (attachment: 'platform' | 'cross-platform') => {
    if (!clientUser) return;
    setLastAttachment(attachment);
    setShowEnclaveConfirm(false);
    setIsBusy(true);
    setFeedback({
      status: 'scanning',
      mode: 'enroll',
      title:
        attachment === 'cross-platform'
          ? 'Waiting for USB / NFC FIDO2 Key'
          : 'Waiting for Biometric Verification',
      message:
        attachment === 'cross-platform'
          ? 'Insert or tap your hardware security key when prompted by your browser...'
          : 'Confirm with Touch ID, Face ID, or Windows Hello to bind this device to your account...'
    });

    const res = await registerHardwareBiometricPasskey({
      email: clientUser.email,
      fullName: clientUser.fullName,
      company: clientUser.company,
      deviceName: deviceLabel.trim() || detectBiometricDeviceName(),
      isLoggedInSession: true,
      authenticatorAttachment: attachment
    });

    setIsBusy(false);

    if (res.success && res.credential) {
      attachBiometricCredential(clientUser.email, res.credential);
      setFeedback({
        status: 'success',
        mode: 'enroll',
        title: 'Biometric Credential Registered',
        message: `"${res.credential.deviceName}" is now active for future passwordless WebAuthn logins.`
      });
      return;
    }

    reportFailure(res, 'enroll');
  };

  const handleRegisterVirtualFido2 = async () => {
    if (!clientUser) return;
    setShowEnclaveConfirm(false);
    setIsBusy(true);
    setFeedback({
      status: 'scanning',
      mode: 'enroll',
      title: 'Generating FIDO2 Enclave Keypair',
      message: 'Binding ECDSA P-256 cryptographic key to your browser and verifying server challenge...'
    });

    const res = await registerVirtualFido2Biometric({
      email: clientUser.email,
      fullName: clientUser.fullName,
      deviceName: `${deviceLabel.trim() || detectBiometricDeviceName()} (FIDO2 Enclave)`,
      isLoggedInSession: true
    });

    setIsBusy(false);

    if (res.success && res.credential) {
      attachBiometricCredential(clientUser.email, res.credential);
      setFeedback({
        status: 'success',
        mode: 'enroll',
        title: 'FIDO2 Enclave Passkey Registered',
        message: `"${res.credential.deviceName}" registered and cryptographically verified.`
      });
    } else {
      reportFailure(res, 'enroll');
    }
  };

  const handleTestVerification = async (authenticatorType: string) => {
    if (!clientUser) return;
    setIsBusy(true);
    setFeedback({
      status: 'scanning',
      mode: 'login',
      title: 'Testing Biometric Passkey',
      message: 'Signing a fresh server WebAuthn challenge to verify your enrolled credential...'
    });

    const res =
      authenticatorType === 'virtual-fido2'
        ? await authenticateVirtualFido2Biometric({ email: clientUser.email })
        : await authenticateHardwareBiometricPasskey({ email: clientUser.email });

    setIsBusy(false);

    if (res.success && res.user) {
      completeBiometricLogin(res.user);
      setFeedback({
        status: 'success',
        mode: 'login',
        title: 'Biometric Verification Passed',
        message: `Live cryptographic assertion verified cleanly using ${res.authenticatedWith?.deviceName || 'Passkey'}. Future passwordless logins are ready.`
      });
    } else {
      reportFailure(res, 'login');
    }
  };

  const handleRevoke = async (credentialId: string) => {
    if (!clientUser) return;
    setIsBusy(true);
    setFeedback({
      status: 'scanning',
      mode: 'revoke',
      title: 'Revoking Credential',
      message: 'Removing public key from DeRoyalTech account vault...'
    });
    const res = await revokeBiometricCredential({
      credentialId,
      userId: clientUser.id,
      email: clientUser.email
    });
    setIsBusy(false);
    removeBiometricCredential(clientUser.id, credentialId);
    setFeedback(
      res.success
        ? {
            status: 'success',
            mode: 'revoke',
            title: 'Biometric Credential Revoked',
            message: 'The passkey was removed and can no longer be used to sign in.'
          }
        : {
            status: 'error',
            mode: 'revoke',
            title: 'Revocation Error',
            message: res.message || 'Unable to revoke credential.',
            errorReason: 'UNKNOWN'
          }
    );
  };

  if (!clientUser) {
    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-5 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
              WebAuthn FIDO2 Security Dashboard
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Sign In to Manage Biometric Credentials
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Enroll Touch ID, Face ID, Windows Hello, or hardware FIDO2 security keys on your client account for instant, phishing-resistant logins.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Client Account</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('register');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Enterprise Account</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="security-dashboard-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
    >
      {/* Dashboard Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-blue-600 dark:text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Client Hub Security Dashboard · WebAuthn FIDO2</span>
          </div>
          <h2
            id="security-dashboard-heading"
            className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white"
          >
            Biometric Authentication & Credential Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Register Touch ID, Face ID, Windows Hello, or hardware security keys to replace password entry during future logins on{' '}
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {typeof window !== 'undefined' ? window.location.hostname : 'deroyal.tech'}
            </span>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={refreshDiagnostics}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-check Sensor Hardware</span>
        </button>
      </div>

      {/* 3-Card Security Posture Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Biometric Login Status
            </span>
            <Fingerprint
              className={`w-5 h-5 ${
                credentials.length > 0 ? 'text-emerald-500' : 'text-amber-500'
              }`}
            />
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
            {credentials.length > 0
              ? `${credentials.length} Active Passkey${credentials.length > 1 ? 's' : ''}`
              : 'No Passkeys Enrolled'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {credentials.length > 0
              ? 'Passwordless WebAuthn authentication is enabled on your account.'
              : 'Enroll your current device below to enable one-tap biometric sign-in.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Verified Client Identity
            </span>
            <CheckCircle2
              className={`w-5 h-5 ${
                clientUser.isVerified ? 'text-emerald-500' : 'text-amber-500'
              }`}
            />
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white truncate">
            {clientUser.fullName}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {clientUser.email} · {clientUser.isVerified ? 'Approved Partner' : 'Pending Approval'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Device Hardware Readiness
            </span>
            <Cpu
              className={`w-5 h-5 ${
                capabilities?.hasPlatformAuthenticator
                  ? 'text-blue-500'
                  : capabilities?.isIframeRestricted
                  ? 'text-cyan-500'
                  : 'text-amber-500'
              }`}
            />
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
            {capabilities === null
              ? 'Scanning Sensor...'
              : capabilities.isIframeRestricted
              ? 'Enclave Ready (Frame Policy)'
              : capabilities.hasPlatformAuthenticator
              ? 'Platform Sensor Ready'
              : capabilities.isSupported
              ? 'External Key / Enclave Ready'
              : 'WebAuthn Unsupported'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {capabilities?.hasPlatformAuthenticator
              ? `${capabilities.recommendedLabel} detected`
              : capabilities?.isIframeRestricted
              ? 'Preview iframe restricts native biometrics; FIDO2 Enclave available'
              : 'No built-in Touch ID / Windows Hello sensor reported; use USB/NFC key or FIDO2 Enclave'}
          </p>
        </div>
      </div>

      {/* Explicit WebAuthn Visual Feedback & Error Panel */}
      <WebAuthnStatusBanner
        feedback={feedback}
        onDismiss={() => {
          setFeedback(null);
          setIsBusy(false);
        }}
        onRetry={() => {
          if (feedback?.mode === 'login') {
            handleTestVerification('platform');
          } else {
            handleRegisterBiometric(lastAttachment);
          }
        }}
        onUseVirtualFido2={() => setShowEnclaveConfirm(true)}
      />

      {/* Interactive Confirmation Card for FIDO2 Enclave Fallback */}
      {showEnclaveConfirm && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/50 text-white space-y-3 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Cryptographic FIDO2 Enclave Registration
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Generates an ECDSA P-256 keypair inside Web Crypto API and registers its SPKI public key against a live server challenge for{' '}
                <strong className="text-white">{clientUser.email}</strong>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isBusy}
              onClick={handleRegisterVirtualFido2}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Confirm & Enroll FIDO2 Enclave Key</span>
            </button>
            <button
              type="button"
              onClick={() => setShowEnclaveConfirm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Registration & Credential Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Enroll New Biometric Credential */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Register Biometric Credential
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bind this device or security key to your profile
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="hub-security-device-label"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Trusted Device Label
            </label>
            <input
              id="hub-security-device-label"
              type="text"
              value={deviceLabel}
              onChange={(e) => setDeviceLabel(e.target.value)}
              placeholder="e.g. Accra HQ MacBook Touch ID"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Executive Laptop Touch ID', 'iPhone Face ID', 'USB Security Key'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDeviceLabel(preset)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleRegisterBiometric('platform')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Register Device Biometrics (Touch ID / Face ID / Windows Hello)</span>
            </button>

            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleRegisterBiometric('cross-platform')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-60 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Register Hardware USB / NFC Security Key</span>
            </button>

            <button
              type="button"
              disabled={isBusy}
              onClick={() => setShowEnclaveConfirm(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 disabled:opacity-60 text-slate-700 dark:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <ScanFace className="w-4 h-4" />
              <span>Enroll Cryptographic FIDO2 Enclave Passkey</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/50 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              Biometric templates never leave your device. Only an asymmetric ECDSA P-256 / RSA public key and signed counter are stored by DeRoyalTech.
            </span>
          </div>
        </div>

        {/* Right: Registered Credentials List */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Registered Biometric Passkeys ({credentials.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Test live cryptographic verification or revoke lost devices
              </p>
            </div>
          </div>

          {credentials.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <Fingerprint className="w-9 h-9 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Biometric Credentials Registered Yet
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Use the registration panel on the left to bind Touch ID, Face ID, Windows Hello, or a FIDO2 security key to your account.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                      {cred.authenticatorType === 'cross-platform' ? (
                        <KeyRound className="w-5 h-5" />
                      ) : cred.authenticatorType === 'virtual-fido2' ? (
                        <ScanFace className="w-5 h-5" />
                      ) : cred.deviceName.toLowerCase().includes('phone') ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {cred.deviceName}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                          {cred.authenticatorType === 'cross-platform'
                            ? 'Hardware Key'
                            : cred.authenticatorType === 'virtual-fido2'
                            ? 'FIDO2 Enclave'
                            : 'Platform Biometric'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span>ID: {cred.id.slice(0, 14)}...</span>
                        <span>Alg: {cred.algorithm === -257 ? 'RS256' : 'ES256 P-256'}</span>
                        <span>Sign-ins: {cred.counter || 0}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          Added {new Date(cred.createdAt).toLocaleDateString()}
                          {cred.lastUsedAt
                            ? ` · Last used ${new Date(cred.lastUsedAt).toLocaleString()}`
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleTestVerification(cred.authenticatorType)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      Verify Live
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleRevoke(cred.id)}
                      title="Revoke Passkey"
                      aria-label={`Revoke biometric credential ${cred.deviceName}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
