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
import ReaderQuestion from '../components/reader/Question';
import { useReader } from '../hooks/useReader';
import { useAppDispatch } from '../redux/hooks';
import { ReaderStatus } from '../types/reader';
import { getTossupWords } from '../utils/reader';
import {
  buzz as buzzAction,
  nextTossup,
  selectTossupReader,
} from './tossupReaderSlice';

type QuestionProps = {
  setBuzz: React.Dispatch<React.SetStateAction<() => void>>;
};

const Question = ({ setBuzz }: QuestionProps) => {
  const visibleRef = useRef<HTMLParagraphElement>(null);
  const {
    status,
    current: {
      tossup: { formattedText },
      buzzIndex,
      tossupWords,
    },
  } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();

  const words = useMemo(
    () => getTossupWords(formattedText).map(({ word }) => word),
    [formattedText],
  );
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
    if (status === ReaderStatus.judged) reveal();
  }, [reveal, status]);

  useEffect(() => {
    if (visibleRef.current === null) return;

    elementScrollIntoView(visibleRef.current, { block: 'center' });
  }, [visibleIndex, buzzIndex, status]);

  const shuffledTossupWords = useMemo(
    () =>
      displayWords.map((word, i) => ({
        word,
        bold: tossupWords[i].bold,
      })),
    [displayWords, tossupWords],
  );

  return (
    <FormattedQuestion
      words={shuffledTossupWords}
      indices={{
        visible: visibleIndex,
        buzz: buzzIndex,
      }}
      visibleRef={visibleRef}
    />
  );
};

type ContainerProps = {
  setBuzz: React.Dispatch<React.SetStateAction<() => void>>;
};

const Container = ({ setBuzz }: ContainerProps) => {
  const { status } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();

  const showLoading = status === ReaderStatus.fetching;
  const showEmpty = status === ReaderStatus.empty;
  const emptyMessage =
    'No tossups found. Try checking your network connection or tweaking the search parameters.';
  const onEmpty = () => dispatch(nextTossup());

  return (
    <ReaderQuestion
      showLoading={showLoading}
      showEmpty={showEmpty}
      emptyMessage={emptyMessage}
      onEmpty={onEmpty}
    >
      <Question setBuzz={setBuzz} />
    </ReaderQuestion>
  );
};

export default Container;
