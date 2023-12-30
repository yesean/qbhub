import { useEffect, useRef } from 'react';

// Hook for scrolling an element into view
export default function useAutoScrollIntoView<T extends Element>(
  dependencies: unknown,
) {
  const visibleRef = useRef<T>(null);

  useEffect(() => {
    if (visibleRef.current != null)
      visibleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
  }, [dependencies]);

  return visibleRef;
}
