import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { getReadingTimeoutDelay } from '../../utils/reader';
import { DEFAULT_READING_SPEED } from '../../utils/settings/constants';

type Props = {
  words: any[];
  onFinish: () => void;
};

export default ({ words, onFinish }: Props) => {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const isFinished = useRef(false);
  const {
    settings: { readingSpeed },
  } = useSettings();

  const readingDelay = getReadingTimeoutDelay(
    readingSpeed ?? DEFAULT_READING_SPEED,
  );

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (visibleIndex === words.length - 1 && !isFinished.current) {
      isFinished.current = true;
      onFinish();
      return;
    }

    if (isPaused) return;

    const timeoutID = setTimeout(() => {
      setVisibleIndex((prevIndex) => prevIndex + 1);
    }, readingDelay);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutID);
  }, [isPaused, onFinish, readingDelay, visibleIndex, words.length]);

  return useMemo(
    () => ({
      visibleIndex,
      pause,
      resume,
    }),
    [pause, resume, visibleIndex],
  );
};
