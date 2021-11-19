export const addShortcut = (
  key: string,
  callback: () => void,
  predicates: boolean[] = [],
) => {
  const listener = (e: KeyboardEvent) => {
    if (e.key === key && predicates.every(Boolean)) callback();
  };
  window.addEventListener('keydown', listener);
  return () => window.removeEventListener('keydown', listener);
};
