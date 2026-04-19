import { useEffect } from 'react';

export function useGlobalClickListener(setSelectedText, handleGlobalClick) {
  useEffect(() => {
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

