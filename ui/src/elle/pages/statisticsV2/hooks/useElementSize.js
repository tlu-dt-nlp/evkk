import { useCallback, useRef, useState } from 'react';

// Tracks an element's rendered size so a chart can be drawn at explicit pixel
// dimensions. Google Charts measures its container once when it draws and only
// redraws on a window resize, which misses a dialog opening or a panel changing
// column width — both leave the chart drawn at the wrong size.
//
// A callback ref is used rather than useEffect so the observer also attaches to
// elements that appear later, such as the fullscreen dialog's chart container.
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
      // Ignore sub-pixel jitter, which would otherwise redraw the chart continuously.
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
