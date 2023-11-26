import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { getReadingTimeoutDelay } from '../../utils/reader';
import { DEFAULT_READING_SPEED } from '../../utils/settings/constants';
import {
  QuestionReaderStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';

type Props = {
  words: any[];
  onFinish: () => void;
};

export default ({ words, onFinish }: Props) => {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const {
    settings: { readingSpeed },
  } = useSettings();
  const { status } = useQuestionReaderContext();

  const readingDelay = getReadingTimeoutDelay(
    readingSpeed ?? DEFAULT_READING_SPEED,
  );

  useEffect(() => {
    if (visibleIndex === words.length - 1) {
      if (!isFinished) {
        setIsFinished(true);
        onFinish();
      }
      return;
    }

    if (status === QuestionReaderStatus.Answering) return;

    if (status === QuestionReaderStatus.Judged) {
      setVisibleIndex(words.length - 1);
      return;
    }

    const timeoutID = setTimeout(() => {
      setVisibleIndex((prevIndex) => prevIndex + 1);
    }, readingDelay);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutID);
  }, [isFinished, onFinish, readingDelay, status, visibleIndex, words.length]);

  return useMemo(
    () => ({
      visibleIndex,
    }),
    [visibleIndex],
  );
};
