import { Box } from '@chakra-ui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import { useAppDispatch } from '../app/hooks';
import { useReader } from '../hooks/reader';
import { getTossupWords, renderQuestion } from '../utils/reader';
import {
  buzz,
  ReaderStatus,
  selectBonusReader,
  setVisible,
} from './bonusReaderSlice';

type LeadinProps = {
  setIsLeadinFinished: React.Dispatch<React.SetStateAction<boolean>>;
};

const Leadin = ({ setIsLeadinFinished }: LeadinProps) => {
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
  const { displayWords, visibleIndex, pause, reveal } = useReader(words, true);

  // update visible index
  useEffect(() => {
    dispatch(setVisible(visibleIndex));
  }, [dispatch, visibleIndex]);

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
    if (visibleIndex === displayWords.length - 1) setIsLeadinFinished(true);
  }, [displayWords.length, setIsLeadinFinished, visibleIndex]);

  useEffect(() => {
    if (visibleRef.current === null) return;

    elementScrollIntoView(visibleRef.current, { block: 'center' });
  }, [visibleIndex, buzzIndex, status]);

  const shuffledQuestionWords = displayWords.map((word) => ({
    word,
    bold: false,
  }));

  return (
    <Box>
      <b>BONUS:</b>{' '}
      {renderQuestion(
        shuffledQuestionWords,
        {
          visible: visibleIndex,
          buzz: buzzIndex,
        },
        visibleRef,
      )}
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
    false,
  );

  // begin reading nonleadin, if leadin doesn't exist or is finished already
  useEffect(() => {
    if (isLeadinFinished) resume();
  }, [hasLeadin, isLeadinFinished, resume]);

  // update visible index
  useEffect(() => {
    dispatch(
      setVisible(hasLeadin ? leadinOffset + visibleIndex : visibleIndex),
    );
  }, [dispatch, hasLeadin, leadinOffset, visibleIndex]);

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

  const shuffledQuestionWords = displayWords.map((word) => ({
    word,
    bold: false,
  }));

  const adjustedBuzzIndex = hasLeadin ? buzzIndex - leadinOffset : buzzIndex;

  return (
    <>
      {hasLeadin && <Leadin setIsLeadinFinished={setIsLeadinFinished} />}
      {isLeadinFinished && (
        <>
          <b>[10]</b>{' '}
        </>
      )}
      {renderQuestion(
        shuffledQuestionWords,
        {
          visible: visibleIndex,
          buzz: adjustedBuzzIndex,
        },
        visibleRef,
      )}
    </>
  );
};

export default ActiveQuestion;
