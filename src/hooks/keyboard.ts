import { useEffect } from 'react';

/**
 * Custom hook for registering keyboard shortcuts.
 * Predicate function is used for "disabling" the shortcut without needing to
 * hardcode the condition in the callback.
 */
export const useKeyboardShortcut = (
  key: string,
  callback: (e: KeyboardEvent) => void,
  predicate: (e: KeyboardEvent) => boolean = () => true,
) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key && predicate(e)) callback(e);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  });
};
