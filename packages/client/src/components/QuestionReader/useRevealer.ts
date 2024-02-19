import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSettings } from '../../hooks/useSettings';
import { getReadingTimeoutDelay } from '../../utils/questionReader';
import { DEFAULT_READING_SPEED } from '../../utils/settings/constants';

type UseRevealerType = {
  pause: () => void;
  reveal: () => void;
  visibleIndex: number;
};

type UseRevealerProps = {
  isRevealed: boolean;
  onChange?: (visibleIndex: number) => void;
  onFinish: () => void;
  words: unknown[];
};

export default function useRevealer({
  isRevealed,
  onChange,
  onFinish,
  words,
}: UseRevealerProps): UseRevealerType {
  const [visibleIndex, setVisibleIndex] = useState(
    isRevealed ? words.length - 1 : -1,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(isRevealed);
  const {
    settings: { readingSpeed },
  } = useSettings();

  const readingDelay = getReadingTimeoutDelay(
    readingSpeed ?? DEFAULT_READING_SPEED,
  );

  const pause = useCallback(() => setIsPaused(true), []);
  const reveal = useCallback(() => {
    setVisibleIndex(words.length - 1);
    onChange?.(words.length - 1);
  }, [onChange, words.length]);

  useEffect(() => {
    // stop when there is no more words
    if (visibleIndex === words.length - 1) {
      if (!isFinished) {
        setIsFinished(true);
        onFinish();
      }
      return;
    }

    if (isPaused) return;

    const timeoutID = setTimeout(() => {
      setVisibleIndex((prevIndex) => prevIndex + 1);
      onChange?.(visibleIndex + 1);
    }, readingDelay);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutID);
  }, [
    isFinished,
    isPaused,
    onChange,
    onFinish,
    readingDelay,
    visibleIndex,
    words.length,
  ]);

  return useMemo(
    () => ({
      pause,
      reveal,
      visibleIndex,
    }),
    [pause, reveal, visibleIndex],
  );
}
