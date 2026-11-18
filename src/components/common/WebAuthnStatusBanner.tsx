import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  Fingerprint,
  KeyRound,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShieldX,
  WifiOff,
  X,
  XCircle,
  Clock,
  Lock
} from 'lucide-react';
import { WebAuthnErrorReason } from '../../utils/webauthn.ts';

export interface WebAuthnFeedbackState {
  status: 'scanning' | 'success' | 'error';
  mode: 'login' | 'enroll' | 'revoke';
  title: string;
  message: string;
  hint?: string;
  errorReason?: WebAuthnErrorReason;
  domErrorName?: string;
  hardwareBlocked?: boolean;
}

interface WebAuthnStatusBannerProps {
  feedback: WebAuthnFeedbackState | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  onOpenEnroll?: () => void;
  onUseVirtualFido2?: () => void;
  onFocusPassword?: () => void;
  showVirtualFido2Option?: boolean;
}

export const WebAuthnStatusBanner: React.FC<WebAuthnStatusBannerProps> = ({
  feedback,
  onDismiss,
  onRetry,
  onOpenEnroll,
  onUseVirtualFido2,
  onFocusPassword,
  showVirtualFido2Option = true
}) => {
  if (!feedback) return null;

  if (feedback.status === 'scanning') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-cyan-50/70 to-blue-50 dark:from-blue-950/60 dark:via-slate-900 dark:to-cyan-950/40 border border-blue-300 dark:border-blue-700/80 text-blue-900 dark:text-blue-100 shadow-sm space-y-2.5 animate-in fade-in duration-150"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-blue-600/15 dark:bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
              <Fingerprint className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-cyan-400" />
                <span>{feedback.title}</span>
              </div>
              <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5 leading-snug">
                {feedback.message}
              </p>
            </div>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Cancel waiting state"
              className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-white rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="w-full h-1.5 rounded-full bg-blue-200/70 dark:bg-slate-800 overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (feedback.status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs space-y-1.5 animate-in fade-in duration-150"
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">{feedback.title}</div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                {feedback.message}
              </p>
            </div>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss success message"
              className="p-1 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Error states categorized explicitly
  const reason = feedback.errorReason || 'UNKNOWN';
  const isCancel = reason === 'USER_CANCELLED';
  const isHardwareMissing = reason === 'HARDWARE_NOT_FOUND' || reason === 'NOT_SUPPORTED';
  const isIframeBlocked = reason === 'IFRAME_POLICY_BLOCKED';
  const isNoCredentials = reason === 'NO_CREDENTIALS';
  const isPending = reason === 'ACCOUNT_PENDING';
  const isNetwork = reason === 'NETWORK_ERROR';
  const isAlreadyRegistered = reason === 'CREDENTIAL_ALREADY_REGISTERED';

  const containerClasses = isCancel
    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100'
    : isIframeBlocked || isPending
    ? 'bg-slate-900 border-cyan-500/50 text-white'
    : isAlreadyRegistered
    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-950 dark:text-blue-100'
    : 'bg-red-50 dark:bg-red-950/45 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100';

  const iconBgClasses = isCancel
    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-400/40'
    : isIframeBlocked || isPending
    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40'
    : isAlreadyRegistered
    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-400/40'
    : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-400/40';

  const renderIcon = () => {
    if (isCancel) return <XCircle className="w-4 h-4" />;
    if (isHardwareMissing) return <Cpu className="w-4 h-4" />;
    if (isIframeBlocked) return <ShieldAlert className="w-4 h-4" />;
    if (isNoCredentials) return <KeyRound className="w-4 h-4" />;
    if (isPending) return <Clock className="w-4 h-4" />;
    if (isNetwork) return <WifiOff className="w-4 h-4" />;
    if (isAlreadyRegistered) return <Lock className="w-4 h-4" />;
    if (reason === 'SIGNATURE_INVALID' || reason === 'SECURITY_MISMATCH') {
      return <ShieldX className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  const badgeLabel =
    reason === 'HARDWARE_NOT_FOUND'
      ? 'HARDWARE NOT FOUND'
      : reason === 'USER_CANCELLED'
      ? 'USER CANCELLED'
      : reason === 'IFRAME_POLICY_BLOCKED'
      ? 'FRAME POLICY BLOCKED'
      : reason === 'NOT_SUPPORTED'
      ? 'UNSUPPORTED BROWSER'
      : reason === 'NO_CREDENTIALS'
      ? 'NO PASSKEY REGISTERED'
      : reason === 'CREDENTIAL_ALREADY_REGISTERED'
      ? 'ALREADY REGISTERED'
      : reason === 'CHALLENGE_EXPIRED'
      ? 'CHALLENGE EXPIRED'
      : reason === 'SIGNATURE_INVALID'
      ? 'SIGNATURE REJECTED'
      : reason === 'SECURITY_MISMATCH'
      ? 'ORIGIN MISMATCH'
      : reason === 'ACCOUNT_PENDING'
      ? 'APPROVAL PENDING'
      : reason === 'ACCOUNT_RESTRICTED'
      ? 'ACCESS RESTRICTED'
      : reason === 'PASSWORD_REQUIRED'
      ? 'PASSWORD REQUIRED'
      : reason === 'NETWORK_ERROR'
      ? 'NETWORK ERROR'
      : 'AUTH FAILURE';

  return (
    <div
      role="alert"
      data-testid="webauthn-error-panel"
      data-error-reason={reason}
      className={`p-3.5 rounded-xl border text-xs space-y-2.5 shadow-sm animate-in fade-in duration-150 ${containerClasses}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${iconBgClasses}`}
          >
            {renderIcon()}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-xs">{feedback.title}</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 uppercase tracking-wide">
                {badgeLabel}
              </span>
              {feedback.domErrorName && (
                <span className="text-[10px] font-mono opacity-75">
                  ({feedback.domErrorName})
                </span>
              )}
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">{feedback.message}</p>
            {feedback.hint && (
              <p className="text-[11px] opacity-80 leading-relaxed border-l-2 border-current/30 pl-2">
                {feedback.hint}
              </p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss biometric error"
            className="p-1 opacity-70 hover:opacity-100 rounded-md transition-opacity shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Explicit Actionable Recovery Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        {onRetry && !isNoCredentials && !isAlreadyRegistered && !isPending && (
          <button
            type="button"
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Biometric Scan</span>
          </button>
        )}

        {isNoCredentials && onOpenEnroll && (
          <button
            type="button"
            onClick={onOpenEnroll}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <KeyRound className="w-3 h-3" />
            <span>Enroll This Device Now</span>
          </button>
        )}

        {showVirtualFido2Option &&
          (feedback.hardwareBlocked || isHardwareMissing || isIframeBlocked) &&
          onUseVirtualFido2 && (
            <button
              type="button"
              onClick={onUseVirtualFido2}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Fingerprint className="w-3 h-3" />
              <span>
                {feedback.mode === 'enroll'
                  ? 'Enroll FIDO2 Enclave Passkey'
                  : 'Authenticate via FIDO2 Enclave'}
              </span>
            </button>
          )}

        {onFocusPassword && (isCancel || isHardwareMissing || reason === 'PASSWORD_REQUIRED') && (
          <button
            type="button"
            onClick={onFocusPassword}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-black/10 hover:bg-black/15 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
          >
            Use Corporate Password
          </button>
        )}
      </div>
    </div>
  );
};
