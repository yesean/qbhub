import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import ReaderQuestion from '../components/reader/Question';
import { useReader } from '../hooks/reader';
import { useAppDispatch } from '../redux/hooks';
import { getTossupWords, renderQuestion } from '../utils/reader';
import {
  buzz,
  nextTossup,
  ReaderStatus,
  selectTossupReader,
  setVisible,
} from './tossupReaderSlice';

const Question = () => {
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
  const { displayWords, visibleIndex, pause, reveal } = useReader(words, {
    onVisibleChange: (index) => dispatch(setVisible(index)),
  });

  // pause reading when answering
  useEffect(() => {
    if (status === ReaderStatus.answering) pause();
  }, [pause, status, visibleIndex]);

  // reveal rest of tossup
  useEffect(() => {
    if (status === ReaderStatus.judged) reveal();
  }, [reveal, status]);

  // buzz at the end of the tossup
  useEffect(() => {
    if (visibleIndex === displayWords.length - 1) dispatch(buzz());
  }, [dispatch, visibleIndex, displayWords.length]);

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

  const renderedQuestion = useMemo(
    () =>
      renderQuestion(
        shuffledTossupWords,
        {
          visible: visibleIndex,
          buzz: buzzIndex,
        },
        visibleRef,
      ),
    [buzzIndex, shuffledTossupWords, visibleIndex],
  );

  return renderedQuestion;
};

const Container = () => {
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
      <Question />
    </ReaderQuestion>
  );
};

export default Container;
