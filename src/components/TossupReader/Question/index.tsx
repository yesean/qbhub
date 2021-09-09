import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Center, CircularProgress, Container, Text } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';

import { Mode, ModeContext } from '../../../services/ModeContext';
import {
  getReadingTimeoutDelay,
  getTextBetweenTags,
  shuffleString,
} from '../../../services/utils';
import { TossupBuzzContext } from '../../../services/TossupBuzzContext';
import logger from '../../../services/logger';
import { TossupSettingsContext } from '../../../services/TossupSettingsContext';

type QuestionProps = {
  text: string;
  formattedText: string;
};

type Word = {
  original: string;
  shuffled: string;
  isInPower: boolean;
};

type PowerWordsCount = {
  [word: string]: number;
};

const getWords = (text: string) =>
  text.split(' ').map((w) => ({
    original: w,
    shuffled: shuffleString(w),
  }));

const getPowerWordsCount = (formattedText: string) => {
  const boldText =
    getTextBetweenTags('strong', formattedText).join(' ') ||
    getTextBetweenTags('b', formattedText).join(' ') ||
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

const getWord = (word: Word, index: number, visibleIndex: number) =>
  index <= visibleIndex ? word.original : word.shuffled;

const computeVisibility = (
  index: number,
  visibleIndex: number,
): 'visible' | 'hidden' => {
  return index <= visibleIndex ? 'visible' : 'hidden';
};

const renderQuestion = (
  words: Word[],
  visibleIndex: number,
  buzzIndex: number,
) =>
  words.map((w, i) => (
    <Fragment key={`${w}${i}`}>
      <Text
        /* eslint react/no-array-index-key: "off" */
        d="inline-flex"
        alignItems="center"
        whiteSpace="pre"
        visibility={computeVisibility(i, visibleIndex)}
        fontWeight={w.isInPower ? 'bold' : 'normal'}
      >
        {`${getWord(w, i, visibleIndex)} `}
      </Text>
      {i === buzzIndex && (
        <Container
          color="cyan.500"
          m={0}
          p={0}
          w="auto"
          d="inline-flex"
          alignItems="center"
          whiteSpace="pre"
          verticalAlign="bottom"
        >
          <BellIcon w={4} h={4} />
          <Text d="inline"> </Text>
        </Container>
      )}
    </Fragment>
  ));

const Question: React.FC<QuestionProps> = ({ text, formattedText }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [incrementId, setIncrementId] = useState<NodeJS.Timeout | null>(null);
  const { mode, setMode } = useContext(ModeContext);
  const { buzz, setBuzz } = useContext(TossupBuzzContext);
  const { readingSpeed } = useContext(TossupSettingsContext);

  const words: Word[] = useMemo(() => {
    const powerWordsCount = getPowerWordsCount(formattedText);
    return getWords(text).map((w) => {
      if (w.original in powerWordsCount && powerWordsCount[w.original] > 0) {
        powerWordsCount[w.original] -= 1;
        return { ...w, isInPower: true };
      }

      return { ...w, isInPower: false };
    });
  }, [text, formattedText]);

  // set buzz on user buzz
  useEffect(() => {
    const word = words[visibleIndex];
    if (mode === Mode.answering) {
      setBuzz({
        readText: words
          .slice(0, visibleIndex)
          .map((w) => w.original)
          .join(' '),
        isInPower: word.isInPower,
        index: visibleIndex,
        textWithBuzz: renderQuestion(words, words.length - 1, visibleIndex),
      });
    }
  }, [mode, setBuzz, visibleIndex, words]);

  // reveal rest of tossup
  useEffect(() => {
    const revealWords = () => {
      setIncrementId(null);
      setVisibleIndex(words.length);
    };
    if (mode === Mode.revealed) {
      logger.info('revealing rest of tossup');
      revealWords();
    }
  }, [incrementId, mode, words.length, text]);

  // pause reading when answering
  useEffect(() => {
    const pauseWords = () => {
      if (incrementId !== null) window.clearTimeout(incrementId);
      setIncrementId(null);
    };
    if (mode === Mode.answering) {
      logger.info('pausing reading for user answer');
      pauseWords();
    }
  }, [incrementId, mode, words.length, text]);

  // reset state when fetching new tossup
  useEffect(() => {
    if (mode === Mode.fetchingTossup) {
      logger.info('resetting state for tossup fetch');
      setVisibleIndex(0);
    }
  }, [mode, incrementId]);

  // read tossup
  useEffect(() => {
    if (mode === Mode.reading) {
      if (visibleIndex < words.length - 1) {
        if (incrementId === null) {
          logger.info(
            'reading speed: ',
            getReadingTimeoutDelay(readingSpeed),
            ' ms/word',
          );
          const id = setTimeout(() => {
            setVisibleIndex((i) =>
              i < words.length && mode === Mode.reading ? i + 1 : i,
            );
            setIncrementId(null);
          }, getReadingTimeoutDelay(readingSpeed));
          setIncrementId(id);
        }
      } else {
        setMode(Mode.answering);
      }
    }
  }, [
    visibleIndex,
    words.length,
    mode,
    setMode,
    text,
    incrementId,
    readingSpeed,
  ]);

  const shouldShowCircularProgress = mode === Mode.fetchingTossup;

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
      overflow="auto"
    >
      {shouldShowCircularProgress ? (
        <Center>
          <CircularProgress isIndeterminate color="cyan.100" />
        </Center>
      ) : (
        renderQuestion(words, visibleIndex, buzz?.index || -1)
      )}
    </Container>
  );
};

export default Question;
