import { useCallback, useMemo, useRef, useState } from 'react';

// Hook for managing input state with focus/blur/select support
export default function useInput() {
  const [userInput, setUserInput] = useState('');
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
      setUserInput,
      userInput,
    }),
    [blurInput, focusInput, selectInput, userInput],
  );
}
