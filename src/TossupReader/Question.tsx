import { Center, CircularProgress, Container } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings } from '../Settings/settingsSlice';
import { TossupReaderWord } from '../types/tossups';
import logger from '../utils/logger';
import { renderQuestion } from '../utils/questionReader';
import { getReadingTimeoutDelay } from '../utils/settings';
import { getTextBetweenTags, shuffle } from '../utils/string';
import {
  buzz,
  ReaderStatus,
  selectTossupReader,
  setBuzz,
} from './tossupReaderSlice';

type PowerWordsCount = {
  [word: string]: number;
};

const getWords = (text: string) =>
  text.split(' ').map((w) => ({
    original: w,
    shuffled: shuffle(w),
  }));

const getPowerWordsCount = (formattedText: string) => {
  const boldText =
    getTextBetweenTags(formattedText, 'strong').join(' ') ||
    getTextBetweenTags(formattedText, 'b').join(' ') ||
    '';

  return boldText
    .replaceAll(/<em>|<\/em>|<i>|<\/i>/g, '')
    .split(' ')
    .reduce<PowerWordsCount>((acc, w) => {
      const wCount = w in acc ? acc[w] + 1 : 1;
      return {
        ...acc,
        [w]: wCount,
      };
    }, {});
};

const Question: React.FC = () => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [incrementId, setIncrementId] = useState<NodeJS.Timeout | null>(null);
  const {
    status,
    currentTossup: { text, formattedText },
    currentBuzz,
  } = useSelector(selectTossupReader);
  const settings = useSelector(selectSettings);
  const dispatch = useDispatch();

  const words: TossupReaderWord[] = useMemo(() => {
    const powerWordsCount = getPowerWordsCount(formattedText);
    return getWords(text).map((w) => {
      if (w.original in powerWordsCount && powerWordsCount[w.original] > 0) {
        powerWordsCount[w.original] -= 1;
        return { ...w, isInPower: true };
      }

      return { ...w, isInPower: false };
    });
  }, [text, formattedText]);

  const revealWords = useCallback(() => {
    logger.info('Revealing rest of tossup.');
    setIncrementId(null);
    setVisibleIndex(words.length);
  }, [words.length]);

  // pause reading when answering
  useEffect(() => {
    const pauseWords = () => {
      if (incrementId !== null) {
        logger.info('Pausing tossup reading.');
        window.clearTimeout(incrementId);
        setIncrementId(null);
      }
    };

    if (status === ReaderStatus.answering) {
      pauseWords();
    }
  }, [incrementId, status]);

  // reveal rest of tossup
  useEffect(() => {
    if (status === ReaderStatus.judged) {
      revealWords();
    }
  }, [revealWords, status]);

  // reset state when fetching new tossup
  useEffect(() => {
    if (status === ReaderStatus.fetching) {
      setVisibleIndex(0);
    }
  }, [status, incrementId]);

  // read tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      if (visibleIndex < words.length) {
        if (incrementId === null) {
          const readingDelay = getReadingTimeoutDelay(settings.readingSpeed);
          const incrementVisibleIndex = () => {
            setVisibleIndex(visibleIndex + 1);
            setIncrementId(null);
          };
          const id = setTimeout(incrementVisibleIndex, readingDelay);
          setIncrementId(id);
          const readText = words
            .slice(0, visibleIndex + 1)
            .map((w) => w.original)
            .join(' ');
          const lastWord = words[visibleIndex];
          const newCurrentBuzz = {
            readText,
            isPower: lastWord.isInPower,
            index: visibleIndex,
            textWithBuzz: words,
          };
          dispatch(setBuzz(newCurrentBuzz));
        }
      } else {
        dispatch(buzz());
      }
    }
  }, [
    dispatch,
    incrementId,
    settings.readingSpeed,
    status,
    visibleIndex,
    words,
  ]);
  return (
    <>
      {renderQuestion(
        words,
        status === ReaderStatus.reading ? -1 : currentBuzz.index,
        visibleIndex,
      )}
    </>
  );
};

const QuestionContainer: React.FC = () => {
  const { status } = useSelector(selectTossupReader);

  const shouldShowCircularProgress = status === ReaderStatus.fetching;
  const shouldShowEmptyMsg = status === ReaderStatus.empty;

  const render = () => {
    if (shouldShowCircularProgress) {
      return (
        <Center>
          <CircularProgress isIndeterminate color="cyan.100" />
        </Center>
      );
    }
    if (shouldShowEmptyMsg) {
      return 'No tossups found. Try tweaking the search parameters.';
    }
    return <Question />;
  };

  return (
    <Container
      maxW="container.md"
      bg="gray.100"
      w="100%"
      mb={4}
      p={4}
      d="flex"
      flexWrap="wrap"
      justifyContent={shouldShowCircularProgress ? 'center' : 'start'}
      borderRadius="md"
    >
      {render()}
    </Container>
  );
};

export default QuestionContainer;
