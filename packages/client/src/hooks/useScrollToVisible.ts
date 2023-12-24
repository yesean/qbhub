import { useCallback, useMemo, useRef } from 'react';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';

// Hook for scrolling an element into view
export default function useScrollIntoView<T extends Element>() {
  const visibleRef = useRef<T>(null);

  const scrollToVisible = useCallback(() => {
    if (visibleRef.current != null)
      elementScrollIntoView(visibleRef.current, { block: 'center' });
  }, []);

  return useMemo(
    () => ({
      scrollToVisible,
      visibleRef,
    }),
    [scrollToVisible],
  );
}
