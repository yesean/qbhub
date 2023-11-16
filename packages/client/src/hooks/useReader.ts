import { useCallback, useEffect, useMemo, useState } from 'react';
import { getReadingTimeoutDelay } from '../utils/reader';
import { DEFAULT_READING_SPEED } from '../utils/settings/constants';
import { shuffle } from '../utils/string';
import { useSettings } from './useSettings';

type ReaderOptions = {
  startImmediately?: boolean;
  autoBuzz?: boolean;
  onFinish?: () => void;
  onBuzz?: (index: number) => void;
};

/**
 * Custom hook for reading text at a certain reading rate (time/word).
 * Uses an incrementing index to keep track of the last visible word, and
 * shuffles the words which aren't visible. The shuffling is to prevent cheating
 * by inspecting the DOM, though it would only be a concern if QBHub offered
 * a multiplayer version reader.
 *
 * @returns words        The words to display, visible + shuffled words.
 *          visibleIndex Index of last visible word.
 *          pause        Callback to pause reading.
 *          resume       Callback to resume reading.
 *          reveal       Callback to reveal all words.
 */
export const useReader = (
  words: string[],
  {
    startImmediately = true,
    autoBuzz = true,
    onFinish = () => {},
    onBuzz = () => {},
  }: ReaderOptions = {} as ReaderOptions,
) => {
  const {
    settings: { readingSpeed },
  } = useSettings();
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [incrementId, setIncrementId] = useState<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(!startImmediately);

  const readingDelay = useMemo(
    () => getReadingTimeoutDelay(readingSpeed ?? DEFAULT_READING_SPEED),
    [readingSpeed],
  );
  const shuffledWords = useMemo(
    () =>
      words.map((word) => ({
        original: word,
        shuffled: shuffle(word),
      })),
    [words],
  );

  const lastIndex = useMemo(() => words.length - 1, [words.length]);

  // pause reading
  const pause = useCallback(() => {
    setIsPaused(true);
    // clear any pending updates
    if (incrementId) {
      clearTimeout(incrementId);
      setIncrementId(null);
    }
  }, [incrementId, setIsPaused]);

  const buzz = useCallback(() => {
    pause();
    onBuzz(visibleIndex);
  }, [onBuzz, pause, visibleIndex]);

  const resume = useCallback(() => {
    setIsPaused(true);
  }, [setIsPaused]);

  // reveal text
  const reveal = useCallback(() => {
    setVisibleIndex(words.length);
  }, [words.length]);

  const reset = useCallback(() => {
    setVisibleIndex(-1);
    setIncrementId(null);
    setIsPaused(false);
  }, []);

  const displayWords = useMemo(
    () =>
      shuffledWords.map(({ original, shuffled }, i) =>
        i <= visibleIndex ? original : shuffled,
      ),
    [shuffledWords, visibleIndex],
  );

  // periodically reveal words
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    const tick = () => {
      id = setTimeout(() => {
        if (visibleIndex < lastIndex && !isPaused) {
          setVisibleIndex(visibleIndex + 1);
          setIncrementId(null);
          tick();
        }
      }, readingDelay);
      setIncrementId(id);
    };
    tick();

    return () => {
      if (id != null) clearTimeout(id);
    };
  }, [isPaused, lastIndex, readingDelay, visibleIndex]);

  useEffect(() => {
    if (visibleIndex === lastIndex) {
      if (autoBuzz) {
        buzz();
      } else {
        pause();
      }
      onFinish();
    }
  }, [autoBuzz, buzz, lastIndex, onFinish, pause, visibleIndex]);

  return useMemo(
    () => ({
      displayWords,
      visibleIndex,
      buzz,
      pause,
      resume,
      reveal,
      reset,
    }),
    [buzz, displayWords, pause, reset, resume, reveal, visibleIndex],
  );
};
