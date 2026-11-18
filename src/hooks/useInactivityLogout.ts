import { useCallback, useEffect, useRef, useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';

// 10 minutes total idle timeout; show live countdown toast during final 60 seconds
const IDLE_TIMEOUT_MS = 10 * 60 * 1000;
const WARNING_SECONDS = 60;

export function useInactivityLogout() {
  const { clientUser, logoutClient } = useSite();
  const [inactivityNotice, setInactivityNotice] = useState<string | null>(null);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(WARNING_SECONDS);

  const logoutRef = useRef(logoutClient);
  logoutRef.current = logoutClient;

  const deadlineRef = useRef<number>(Date.now() + IDLE_TIMEOUT_MS);
  const warningActiveRef = useRef<boolean>(false);

  const clientUserId = clientUser?.id ?? null;

  const stayLoggedIn = useCallback(() => {
    deadlineRef.current = Date.now() + IDLE_TIMEOUT_MS;
    warningActiveRef.current = false;
    setIsWarningVisible(false);
    setSecondsRemaining(WARNING_SECONDS);
    setInactivityNotice(null);
  }, []);

  useEffect(() => {
    if (!clientUserId) {
      warningActiveRef.current = false;
      setIsWarningVisible(false);
      setSecondsRemaining(WARNING_SECONDS);
      return;
    }

    // User just signed in — clear any prior timeout banner and start fresh timer
    setInactivityNotice(null);
    deadlineRef.current = Date.now() + IDLE_TIMEOUT_MS;
    warningActiveRef.current = false;
    setIsWarningVisible(false);
    setSecondsRemaining(WARNING_SECONDS);

    const handleActivity = () => {
      // Once the final countdown toast is visible, require clicking "Stay Logged In"
      if (warningActiveRef.current) return;
      deadlineRef.current = Date.now() + IDLE_TIMEOUT_MS;
    };

    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click'
    ];
    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    const intervalId = window.setInterval(() => {
      const remainingMs = deadlineRef.current - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      if (remainingMs <= 0) {
        window.clearInterval(intervalId);
        warningActiveRef.current = false;
        setIsWarningVisible(false);
        setSecondsRemaining(0);
        logoutRef.current();
        setInactivityNotice(
          'You were automatically logged out due to 10 minutes of inactivity to protect your account.'
        );
        return;
      }

      if (remainingSec <= WARNING_SECONDS) {
        warningActiveRef.current = true;
        setIsWarningVisible(true);
        setSecondsRemaining((prev) => (prev !== remainingSec ? remainingSec : prev));
      } else if (warningActiveRef.current) {
        warningActiveRef.current = false;
        setIsWarningVisible(false);
      }
    }, 500);

    return () => {
      window.clearInterval(intervalId);
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [clientUserId]);

  const dismissNotice = useCallback(() => setInactivityNotice(null), []);

  return {
    inactivityNotice,
    dismissNotice,
    isWarningVisible,
    secondsRemaining,
    warningTotalSeconds: WARNING_SECONDS,
    stayLoggedIn
  };
}
