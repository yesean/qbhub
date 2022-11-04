import { Box } from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import { useReader } from '../hooks/useReader';
import { useAppDispatch } from '../redux/hooks';
import { getTossupWords, renderQuestion } from '../utils/reader';
import {
  buzz,
  ReaderStatus,
  selectBonusReader,
  setVisible,
} from './bonusReaderSlice';

type LeadinProps = {
  onFinish: () => void;
};

const Leadin = ({ onFinish }: LeadinProps) => {
  const visibleRef = useRef<HTMLParagraphElement>(null);
  const {
    status,
    current: {
      buzzIndex,
      bonus: { formattedLeadin },
    },
  } = useSelector(selectBonusReader);
  const dispatch = useAppDispatch();

  const words = useMemo(
    () => getTossupWords(formattedLeadin).map(({ word }) => word),
    [formattedLeadin],
  );
  const { displayWords, visibleIndex, pause, reveal } = useReader(words, {
    startImmediately: true,
    onVisibleChange: (index) => dispatch(setVisible(index)),
  });

  // pause reading when answering
  useEffect(() => {
    if (status === ReaderStatus.answering) pause();
  }, [pause, status]);

  // reveal rest of tossup
  useEffect(() => {
    if ([ReaderStatus.judged, ReaderStatus.partialJudged].includes(status))
      reveal();
  }, [reveal, status]);

  // buzz at the end of the tossup
  useEffect(() => {
    if (visibleIndex === displayWords.length - 1) onFinish();
  }, [displayWords.length, onFinish, visibleIndex]);

  useEffect(() => {
    if (visibleRef.current === null) return;

    elementScrollIntoView(visibleRef.current, { block: 'center' });
  }, [visibleIndex, buzzIndex, status]);

  const shuffledQuestionWords = useMemo(
    () =>
      displayWords.map((word) => ({
        word,
        bold: false,
      })),
    [displayWords],
  );

  const renderedQuestion = useMemo(
    () =>
      renderQuestion(
        shuffledQuestionWords,
        {
          visible: visibleIndex,
          buzz: buzzIndex,
        },
        visibleRef,
      ),
    [buzzIndex, shuffledQuestionWords, visibleIndex],
  );

  return (
    <Box>
      <b>BONUS:</b> {renderedQuestion}
    </Box>
  );
};

const ActiveQuestion = () => {
  const visibleRef = useRef<HTMLParagraphElement>(null);
  const {
    status,
    current: {
      buzzIndex,
      part: { formattedText },
      bonus: { formattedLeadin },
      number,
    },
  } = useSelector(selectBonusReader);
  const dispatch = useAppDispatch();

  const hasLeadin = number === 1;
  const leadinOffset = useMemo(
    () => getTossupWords(formattedLeadin).length,
    [formattedLeadin],
  );
  const [isLeadinFinished, setIsLeadinFinished] = useState(!hasLeadin);

  const words = useMemo(
    () => getTossupWords(formattedText).map(({ word }) => word),
    [formattedText],
  );
  const { displayWords, visibleIndex, pause, resume, reveal } = useReader(
    words,
    {
      startImmediately: false,
      onVisibleChange: (index) =>
        dispatch(setVisible(hasLeadin ? leadinOffset + index : index)),
    },
  );

  // begin reading nonleadin, if leadin doesn't exist or is finished already
  useEffect(() => {
    if (isLeadinFinished) resume();
  }, [hasLeadin, isLeadinFinished, resume]);

  // pause reading when answering
  useEffect(() => {
    if (status === ReaderStatus.answering) pause();
  }, [pause, status]);

  // reveal rest of tossup
  useEffect(() => {
    if ([ReaderStatus.judged, ReaderStatus.partialJudged].includes(status))
      reveal();
  }, [reveal, status]);

  // buzz at the end of the tossup
  useEffect(() => {
    if (visibleIndex === displayWords.length - 1) dispatch(buzz());
  }, [dispatch, visibleIndex, displayWords.length]);

  useEffect(() => {
    if (visibleRef.current === null) return;

    elementScrollIntoView(visibleRef.current, { block: 'center' });
  }, [visibleIndex, buzzIndex, status]);

  const shuffledQuestionWords = useMemo(
    () =>
      displayWords.map((word) => ({
        word,
        bold: false,
      })),
    [displayWords],
  );

  const renderedQuestion = useMemo(() => {
    const adjustedBuzzIndex = hasLeadin ? buzzIndex - leadinOffset : buzzIndex;
    return renderQuestion(
      shuffledQuestionWords,
      {
        visible: visibleIndex,
        buzz: adjustedBuzzIndex,
      },
      visibleRef,
    );
  }, [buzzIndex, hasLeadin, leadinOffset, shuffledQuestionWords, visibleIndex]);

  return (
    <>
      {hasLeadin && <Leadin onFinish={() => setIsLeadinFinished(true)} />}
      {isLeadinFinished && (
        <>
          <b>[10]</b>{' '}
        </>
      )}
      {renderedQuestion}
    </>
  );
};

export default ActiveQuestion;
