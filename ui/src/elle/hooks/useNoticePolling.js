import { useCallback, useEffect, useRef } from 'react';
import { useGetActiveNotices } from './service/RootService';

export const NOTICE_POLL_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

export const useNoticePolling = (setNotices) => {
  const { getActiveNotices } = useGetActiveNotices();
  const lastFetchedAtRef = useRef(Date.now());

  const refreshNotices = useCallback(async () => {
    lastFetchedAtRef.current = Date.now();
    try {
      const notices = await getActiveNotices();
      if (Array.isArray(notices)) {
        setNotices(notices);
      }
    } catch {
      // keep showing the current notices; the next poll will try again
    }
  }, [getActiveNotices, setNotices]);

  useEffect(() => {
    const isStale = () => Date.now() - lastFetchedAtRef.current >= NOTICE_POLL_INTERVAL_MS;

    const intervalId = setInterval(() => {
      if (!document.hidden) {
        refreshNotices();
      }
    }, NOTICE_POLL_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (!document.hidden && isStale()) {
        refreshNotices();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshNotices]);

  return { refreshNotices };
};
