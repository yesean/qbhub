import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSettings } from '../Settings/settingsSlice';
import { getCleanedWords } from '../utils/reader';
import { getReadingTimeoutDelay } from '../utils/settings';
import { shuffle } from '../utils/string';

/**
 * Custom hook for reading text at a certain reading rate (time/word).
 * Uses an incrementing index to keep track of the last visible word, and
 * shuffles the words which aren't visible. The shuffling is to prevent cheating
 * by inspecting the DOM, though it would only be a concern if QBHub offered
 * a multiplayer version reader.
 * @returns {string[]} words The words to display, visible + shuffled words.
 * @returns {number} visibleIndex Index of last visible word.
 * @returns {Function} pause Callback to pause reading.
 * @returns {Function} resume Callback to resume reading.
 * @returns {Function} reveal Callback to reveal all words.
 */
export const useReader = (text: string, startImmediately = true) => {
  const { readingSpeed } = useSelector(selectSettings);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [incrementId, setIncrementId] = useState<NodeJS.Timeout | null>(null);
  const [shouldRead, setShouldRead] = useState(startImmediately);

  const readingDelay = useMemo(
    () => getReadingTimeoutDelay(readingSpeed),
    [readingSpeed],
  );
  const words = useMemo(() => {
    const textWords = getCleanedWords(text);
    return textWords.map((word) => ({
      original: word,
      shuffled: shuffle(word),
    }));
  }, [text]);

  // periodically reveal words
  useEffect(() => {
    if (visibleIndex < words.length - 1 && incrementId === null && shouldRead) {
      const id = setTimeout(() => {
        setVisibleIndex((index) => index + 1);
        setIncrementId(null);
      }, readingDelay);
      setIncrementId(id);
    }
  }, [incrementId, readingDelay, shouldRead, visibleIndex, words.length]);

  // pause reading
  const pause = useCallback(() => {
    setShouldRead(false);
    // clear any pending updates
    if (incrementId) {
      clearTimeout(incrementId);
      setIncrementId(null);
    }
  }, [incrementId]);

  const resume = useCallback(() => {
    setShouldRead(true);
  }, []);

  // reveal text
  const reveal = useCallback(() => {
    pause();
    setVisibleIndex(words.length);
  }, [pause, words.length]);

  const visible = words
    .slice(0, visibleIndex + 1)
    .map(({ original }) => original);
  const hidden = words.slice(visibleIndex + 1).map(({ original }) => original);

  return {
    words: [...visible, ...hidden],
    visibleIndex,
    pause,
    resume,
    reveal,
  };
};
