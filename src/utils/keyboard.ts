export const addShortcut = (key: string, callback: () => void) => {
  const listener = (e: KeyboardEvent) => {
    if (e.key === key) callback();
  };
  window.addEventListener('keydown', listener);
  return () => window.removeEventListener('keydown', listener);
};
