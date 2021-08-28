import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Center, CircularProgress, Container, Text } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';

import { Mode, ModeContext } from '../../../services/ModeContext';
import { getTextBetweenTags, shuffleString } from '../../../services/utils';
import { TossupBuzzContext } from '../../../services/TossupBuzzContext';
import logger from '../../../services/logger';

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
  if (boldText) logger.info('boldText: ', boldText);

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

const Question: React.FC<QuestionProps> = ({ text, formattedText }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [incrementIds, setIncrementIds] = useState<NodeJS.Timeout[]>([]);
  const { mode, setMode } = useContext(ModeContext);
  const { buzz, setBuzz } = useContext(TossupBuzzContext);

  const words: Word[] = useMemo(() => {
    const powerWordsCount = getPowerWordsCount(formattedText);
    if (text !== '' && formattedText !== '')
      logger.info('powerWordsCount: ', powerWordsCount);
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
      });
    }
  }, [mode, setBuzz, visibleIndex, words]);

  // reveal rest of tossup
  useEffect(() => {
    const revealWords = () => {
      incrementIds.forEach(window.clearTimeout);
      setIncrementIds((ids) => (ids.length > 0 ? [] : ids));
      setVisibleIndex(words.length);
    };
    if (mode === Mode.revealed) {
      revealWords();
    }
  }, [incrementIds, mode, words.length, text]);

  // pause reading when answering
  useEffect(() => {
    const pauseWords = () => {
      incrementIds.forEach(window.clearTimeout);
      setIncrementIds((ids) => (ids.length > 0 ? [] : ids));
    };
    if (mode === Mode.answering) {
      pauseWords();
    }
  }, [incrementIds, mode, words.length, text]);

  // reset state when fetching new tossup
  useEffect(() => {
    if (mode === Mode.fetchingTossup) {
      incrementIds.forEach(window.clearTimeout);
      setIncrementIds((ids) => (ids.length > 0 ? [] : ids));
      setVisibleIndex(0);
    }
  }, [mode, incrementIds]);

  // read tossup at 1word/250ms
  useEffect(() => {
    if (mode === Mode.reading) {
      if (visibleIndex < words.length - 1) {
        const id = setTimeout(
          () =>
            setVisibleIndex((i) =>
              i < words.length && mode === Mode.reading ? i + 1 : i
            ),
          250
        );
        setIncrementIds((ids) => [...ids, id]);
      } else {
        setMode(Mode.answering);
      }
    }
  }, [visibleIndex, words.length, mode, setMode, text]);

  const getWord = (word: Word, index: number) =>
    index <= visibleIndex ? word.original : word.shuffled;

  const computeVisibility = (index: number): 'visible' | 'hidden' => {
    return index <= visibleIndex ? 'visible' : 'hidden';
  };

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
    >
      {shouldShowCircularProgress && (
        <Center>
          <CircularProgress isIndeterminate color="cyan.100" />
        </Center>
      )}
      {words.map((w, i) => (
        <Fragment key={`${w}${i}`}>
          <Text
            /* eslint react/no-array-index-key: "off" */
            d="inline-flex"
            alignItems="center"
            whiteSpace="pre"
            visibility={computeVisibility(i)}
            fontWeight={w.isInPower ? 'bold' : 'normal'}
          >
            {`${getWord(w, i)} `}
          </Text>
          {i === buzz?.index && (
            <Container
              color="cyan.500"
              m={0}
              p={0}
              w="auto"
              d="inline-flex"
              alignItems="center"
              whiteSpace="pre"
            >
              <BellIcon w={4} h={4} />
              <Text d="inline"> </Text>
            </Container>
          )}
        </Fragment>
      ))}
    </Container>
  );
};

export default Question;
