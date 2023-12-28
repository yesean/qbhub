import { useMemo, useState } from 'react';
import useInputHandle from './useInputHandle';

// Hook for managing input state with focus/blur/select support
export default function useInput(initialUserInput: string = '') {
  const [userInput, setUserInput] = useState(initialUserInput);
  const { blurInput, focusInput, inputRef, selectInput } = useInputHandle();

  return useMemo(
    () => ({
      blurInput,
      focusInput,
      inputRef,
      selectInput,
      setUserInput,
      userInput,
    }),
    [blurInput, focusInput, inputRef, selectInput, userInput],
  );
}
