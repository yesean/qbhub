import { useCallback, useMemo, useRef } from 'react';

// Hook for managing focus/blur/select behavior on input elements
export default function useInputHandle() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    if (inputRef.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  }, []);
  const blurInput = useCallback(() => inputRef.current?.blur(), []);
  const selectInput = useCallback(() => inputRef.current?.select(), []);

  return useMemo(
    () => ({
      blurInput,
      focusInput,
      inputRef,
      selectInput,
    }),
    [blurInput, focusInput, selectInput],
  );
}
