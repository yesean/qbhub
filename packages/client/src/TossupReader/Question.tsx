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
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';
import { ReaderStatus, getFormattedWords } from '../utils/reader';
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
    current: {
      buzzIndex,
      formattedWords,
      tossup: { formattedText },
    },
    status,
  } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();

  const words = useMemo(
    () => getFormattedWords(formattedText).map(({ value }) => value),
    [formattedText],
  );

  const { buzz, displayWords, reveal, visibleIndex } = useReader(words, {
    onBuzz: useCallback(
      (index: number) => dispatch(buzzAction(index)),
      [dispatch],
    ),
  });

  const shuffledFormattedWords = useMemo(
    () =>
      displayWords.map((word, i) => ({
        isBold: formattedWords[i].isBold,
        value: word,
      })),
    [displayWords, formattedWords],
  );

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

  return (
    <FormattedQuestion
      indices={{
        buzz: buzzIndex,
        visible: visibleIndex,
      }}
      visibleRef={visibleRef}
      words={shuffledFormattedWords}
    />
  );
};

type ContainerProps = {
  setBuzz: React.Dispatch<React.SetStateAction<() => void>>;
};

const Container = ({ setBuzz }: ContainerProps) => {
  const { status } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const showLoading = status === ReaderStatus.fetching;
  const showEmpty = status === ReaderStatus.empty;
  const emptyMessage =
    'No tossups found. Try checking your network connection or tweaking the search parameters.';
  const onEmpty = () => dispatch(nextTossup({ settings }));

  return (
    <ReaderQuestion
      emptyMessage={emptyMessage}
      onEmpty={onEmpty}
      showEmpty={showEmpty}
      showLoading={showLoading}
    >
      <Question setBuzz={setBuzz} />
    </ReaderQuestion>
  );
};

export default Container;
