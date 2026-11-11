import { useEffect, useRef, useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';

// 10 minutes idle timeout
const IDLE_TIMEOUT_MS = 10 * 60 * 1000;

export function useInactivityLogout() {
  const { clientUser, logoutClient } = useSite();
  const [inactivityNotice, setInactivityNotice] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!clientUser) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        logoutClient();
        setInactivityNotice('You were automatically logged out due to 10 minutes of inactivity to protect your account.');
      }, IDLE_TIMEOUT_MS);
    };

    // Listen to user interaction events
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [clientUser, logoutClient]);

  const dismissNotice = () => setInactivityNotice(null);

  return { inactivityNotice, dismissNotice };
}
