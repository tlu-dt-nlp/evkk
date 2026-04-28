import { useEffect, useRef, useState } from 'react';

const MATCHING_MOBILE_MIN_HEIGHT_RATIO = 0.24;
const MATCHING_DESKTOP_MIN_HEIGHT_RATIO = 0.2;
const MATCHING_COLLAPSE_SPEED = 0.8;
const MATCHING_SPACER_RELEASE_DELAY = 48;

export const useMatchingBankStickySizing = ({
                                              isMatchingFormat,
                                              isAnswered,
                                              availableMatchingOptionsCount
                                            }) => {
  const [matchingOptionsMaxHeight, setMatchingOptionsMaxHeight] = useState(null);
  const [matchingCollapseSpacerHeight, setMatchingCollapseSpacerHeight] = useState(0);
  const matchingBankRef = useRef(null);
  const matchingInitialOptionsHeightRef = useRef(0);
  const matchingStickyScrollStartRef = useRef(null);
  const matchingAnimationFrameRef = useRef(null);

  useEffect(() => {
    if (!isMatchingFormat || isAnswered) {
      setMatchingOptionsMaxHeight(null);
      setMatchingCollapseSpacerHeight(0);
      return;
    }

    const measure = () => {
      const stickyElement = matchingBankRef.current;
      const optionsElement = stickyElement?.querySelector('.matching-options-wrapper');

      if (!stickyElement || !optionsElement) {
        setMatchingOptionsMaxHeight(null);
        setMatchingCollapseSpacerHeight(0);
        return;
      }

      const stickyTop = Number.parseFloat(globalThis.getComputedStyle(stickyElement).top) || 0;
      const isPinned = stickyElement.getBoundingClientRect().top <= stickyTop + 0.5;

      if (!isPinned) {
        matchingStickyScrollStartRef.current = null;
        matchingInitialOptionsHeightRef.current = optionsElement.scrollHeight;
        setMatchingOptionsMaxHeight(null);
        setMatchingCollapseSpacerHeight(0);
        return;
      }

      if (matchingStickyScrollStartRef.current === null) {
        matchingStickyScrollStartRef.current = window.scrollY;
      }

      if (matchingInitialOptionsHeightRef.current === 0) {
        matchingInitialOptionsHeightRef.current = optionsElement.scrollHeight;
      }

      const initialHeight = matchingInitialOptionsHeightRef.current;
      const minHeightRatio = window.innerWidth <= 600
        ? MATCHING_MOBILE_MIN_HEIGHT_RATIO
        : MATCHING_DESKTOP_MIN_HEIGHT_RATIO;

      const minHeight = Math.min(initialHeight, Math.round(window.innerHeight * minHeightRatio));
      const maxCollapse = Math.max(0, initialHeight - minHeight);
      const rawScrolledWhilePinned = Math.max(0, window.scrollY - matchingStickyScrollStartRef.current);
      const collapseProgress = Math.min(maxCollapse, rawScrolledWhilePinned * MATCHING_COLLAPSE_SPEED);
      const nextHeight = Math.round(initialHeight - collapseProgress);

      const nextSpacer = getNextSpacerHeight(rawScrolledWhilePinned, maxCollapse);

      setMatchingOptionsMaxHeight(nextHeight);
      setMatchingCollapseSpacerHeight(Math.round(nextSpacer));
    };

    const onScrollOrResize = () => {
      if (matchingAnimationFrameRef.current !== null) {
        globalThis.cancelAnimationFrame(matchingAnimationFrameRef.current);
      }

      matchingAnimationFrameRef.current = globalThis.requestAnimationFrame(() => {
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (matchingAnimationFrameRef.current !== null) {
        globalThis.cancelAnimationFrame(matchingAnimationFrameRef.current);
        matchingAnimationFrameRef.current = null;
      }
    };
  }, [availableMatchingOptionsCount, isAnswered, isMatchingFormat]);

  const matchingBankStyle = matchingOptionsMaxHeight
    ? {
      '--matching-options-max-height': `${matchingOptionsMaxHeight}px`,
      '--matching-bank-collapse-spacer': `${matchingCollapseSpacerHeight}px`
    }
    : undefined;

  return {
    matchingBankRef,
    matchingBankStyle
  };
};

const getCollapseScrollDistance = maxCollapse => {
  if (MATCHING_COLLAPSE_SPEED <= 0) {
    return 0;
  }

  return maxCollapse / MATCHING_COLLAPSE_SPEED;
};

const getNextSpacerHeight = (rawScrolledWhilePinned, maxCollapse) => {
  const collapseScrollDistance = getCollapseScrollDistance(maxCollapse);
  const spacerAtFullCollapse = Math.max(0, collapseScrollDistance);

  // while collapsing
  if (rawScrolledWhilePinned < collapseScrollDistance) {
    return rawScrolledWhilePinned;
  }

  // right after fully collapsed
  if (rawScrolledWhilePinned < collapseScrollDistance + MATCHING_SPACER_RELEASE_DELAY) {
    return spacerAtFullCollapse;
  }

  // release spacer
  const scrollAfterSpacerReleaseStart = rawScrolledWhilePinned - collapseScrollDistance - MATCHING_SPACER_RELEASE_DELAY;
  return Math.max(0, spacerAtFullCollapse - scrollAfterSpacerReleaseStart);
};
