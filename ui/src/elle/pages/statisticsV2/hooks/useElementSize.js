import { useCallback, useRef, useState } from 'react';

export const useElementSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const nodeRef = useRef(null);
  const observerRef = useRef(null);

  const ref = useCallback((node) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    nodeRef.current = node;

    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize(prev => (Math.round(prev.width) === Math.round(width)
      && Math.round(prev.height) === Math.round(height)
        ? prev
        : { width, height }));
    });
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return [ref, size, nodeRef];
};
