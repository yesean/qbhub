import React, { useEffect, useMemo, useRef } from 'react';
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

const ActiveQuestion = () => {
  const visibleRef = useRef<HTMLParagraphElement>(null);
  const {
    status,
    current: {
      buzzIndex,
      part: { formattedText },
    },
  } = useSelector(selectBonusReader);
  const dispatch = useAppDispatch();

  const words = useMemo(
    () => getTossupWords(formattedText).map(({ word }) => word),
    [formattedText],
  );
  const { displayWords, visibleIndex, pause, reveal } = useReader(words);

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

  const shuffledQuestionWords = displayWords.map((word) => ({
    word,
    bold: false,
  }));

  return (
    <>
      {renderQuestion(
        shuffledQuestionWords,
        {
          visible: visibleIndex,
          buzz: buzzIndex,
        },
        visibleRef,
      )}
    </>
  );
};

export default ActiveQuestion;
