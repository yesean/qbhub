import { useEffect } from 'react';

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  predicate: () => boolean,
) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (predicate()) {
      const listener = (e: KeyboardEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener('keydown', listener);
      return () => window.removeEventListener('keydown', listener);
    }
  });
};
