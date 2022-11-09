import { useEffect, useState } from 'react';

/*
 * This hook keeps track of page height with window.innerHeight, updating on
 * window resizes. This is more reliable than 100vh, since 100vh includes the
 * address bar on mobile devices.
 * */
export default function usePageHeight() {
  const [pageHeight, setPageHeight] = useState(window.innerHeight);

  useEffect(() => {
    const resize = () => {
      setPageHeight(window.innerHeight);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return pageHeight;
}
