import { Box, Text } from '@chakra-ui/react';
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
import { ReaderStatus } from '../types/reader';
import { TossupWord } from '../types/tossups';
import { getTossupWords } from '../utils/reader';
import { buzz as buzzAction, selectBonusReader } from './bonusReaderSlice';

type SectionProps = {
  prefix: string;
  words: TossupWord[];
  buzzIndex: number;
  visibleIndex: number;
  visibleRef: React.RefObject<HTMLParagraphElement>;
};

const Section = ({
  prefix,
  words,
  buzzIndex,
  visibleIndex,
  visibleRef,
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
        visibility={visibleIndex < 0 ? 'hidden' : 'visible'}
        fontWeight="bold"
      >
        {prefix}
      </Text>{' '}
      <FormattedQuestion
        words={words}
        indices={{ visible: visibleIndex, buzz: buzzIndex }}
        visibleRef={visibleRef}
      />
    </Box>
  );
};

// map word for FormattedQuestion
const transformWord = (word: string) => ({ word, bold: false });

type ActiveQuestionProps = {
  setBuzz: React.Dispatch<React.SetStateAction<() => void>>;
};

const ActiveQuestion = ({ setBuzz }: ActiveQuestionProps) => {
  const visibleRef = useRef<HTMLParagraphElement>(null);
  const {
    status,
    current: {
      buzzIndex,
      bonus: { formattedLeadin },
      part: { formattedText },
      number,
    },
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

  const { buzz, reveal, displayWords, visibleIndex } = useReader(words, {
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
        prefix="[10]"
        words={shuffledQuestionWords}
        buzzIndex={buzzIndex}
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
      />
    );
  }

  return (
    <>
      <Section
        prefix="BONUS:"
        words={leadinWords}
        buzzIndex={buzzIndex}
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
      />
      <Section
        prefix="[10]"
        words={remainingWords}
        buzzIndex={buzzIndex - leadinOffset}
        visibleIndex={visibleIndex - leadinOffset}
        visibleRef={visibleRef}
      />
    </>
  );
};

export default ActiveQuestion;
