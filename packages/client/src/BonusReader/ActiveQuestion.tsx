import { Box, Text } from '@chakra-ui/react';
import { TossupWord } from '@qbhub/types';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { useReader } from '../hooks/useReader';
import { useAppDispatch } from '../redux/hooks';
import { ReaderStatus, getTossupWords } from '../utils/reader';
import { buzz as buzzAction, selectBonusReader } from './bonusReaderSlice';

type SectionProps = {
  buzzIndex: number;
  prefix: string;
  visibleIndex: number;
  visibleRef: React.RefObject<HTMLParagraphElement>;
  words: TossupWord[];
};

const Section = ({
  buzzIndex,
  prefix,
  visibleIndex,
  visibleRef,
  words,
}: SectionProps) => {
  useEffect(() => {
    if (
      visibleRef.current === null ||
      visibleIndex < 0 ||
      visibleIndex > words.length - 1
    )
      return;

    elementScrollIntoView(visibleRef.current, { block: 'center' });
  }, [visibleIndex, visibleRef, words.length]);

  return (
    <Box>
      <Text
        display="inline-block"
        fontWeight="bold"
        visibility={visibleIndex < 0 ? 'hidden' : 'visible'}
      >
        {prefix}
      </Text>{' '}
      <FormattedQuestion
        indices={{ buzz: buzzIndex, visible: visibleIndex }}
        visibleRef={visibleRef}
        words={words}
      />
    </Box>
  );
};

// map word for FormattedQuestion
const transformWord = (word: string) => ({ bold: false, word });

type ActiveQuestionProps = {
  setBuzz: React.Dispatch<React.SetStateAction<() => void>>;
};

const ActiveQuestion = ({ setBuzz }: ActiveQuestionProps) => {
  const visibleRef = useRef<HTMLParagraphElement>(null);
  const {
    current: {
      bonus: { formattedLeadin },
      buzzIndex,
      number,
      part: { formattedText },
    },
    status,
  } = useSelector(selectBonusReader);
  const dispatch = useAppDispatch();

  const { hasLeadin, leadinOffset, words } = useMemo(() => {
    const leadin = getTossupWords(formattedLeadin);
    const text = getTossupWords(formattedText);
    const combinedWords = number === 1 ? [...leadin, ...text] : text;

    return {
      hasLeadin: number === 1,
      leadinOffset: leadin.length,
      words: combinedWords.map(({ word }) => word),
    };
  }, [formattedLeadin, formattedText, number]);

  const { buzz, displayWords, reveal, visibleIndex } = useReader(words, {
    onBuzz: useCallback(
      (index: number) => dispatch(buzzAction(index)),
      [dispatch],
    ),
  });

  useLayoutEffect(() => {
    setBuzz(() => buzz);
  }, [buzz, setBuzz]);

  // reveal rest of tossup
  useEffect(() => {
    if ([ReaderStatus.judged, ReaderStatus.partialJudged].includes(status))
      reveal();
  }, [reveal, status]);

  const shuffledQuestionWords = useMemo(
    () => displayWords.map(transformWord),
    [displayWords],
  );

  const leadinWords = useMemo(
    () => shuffledQuestionWords.slice(0, leadinOffset),
    [leadinOffset, shuffledQuestionWords],
  );
  const remainingWords = useMemo(
    () => shuffledQuestionWords.slice(leadinOffset),
    [leadinOffset, shuffledQuestionWords],
  );

  if (!hasLeadin) {
    return (
      <Section
        buzzIndex={buzzIndex}
        prefix="[10]"
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
        words={shuffledQuestionWords}
      />
    );
  }

  return (
    <>
      <Section
        buzzIndex={buzzIndex}
        prefix="BONUS:"
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
        words={leadinWords}
      />
      <Section
        buzzIndex={buzzIndex - leadinOffset}
        prefix="[10]"
        visibleIndex={visibleIndex - leadinOffset}
        visibleRef={visibleRef}
        words={remainingWords}
      />
    </>
  );
};

export default ActiveQuestion;
