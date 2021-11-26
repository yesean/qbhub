import { useEffect } from 'react';

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  predicate: (e: KeyboardEvent) => boolean = () => true,
) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key && predicate(e)) callback();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  });
};
