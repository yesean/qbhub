import { useCallback, useMemo, useRef } from 'react';

// Hook for scrolling an element into view
export default function useScrollIntoView<T extends Element>() {
  const visibleRef = useRef<T>(null);

  const scrollToVisible = useCallback(() => {
    if (visibleRef.current != null) visibleRef.current?.scrollIntoView(false);
  }, []);

  return useMemo(
    () => ({
      scrollToVisible,
      visibleRef,
    }),
    [scrollToVisible],
  );
}
