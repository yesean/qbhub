import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReaderQuestion from '../components/reader/Question';
import { useReader } from '../hooks/reader';
import { renderQuestion } from '../utils/reader';
import {
  buzz,
  ReaderStatus,
  selectTossupReader,
  setVisible,
} from './tossupReaderSlice';

const Question = () => {
  const {
    status,
    current: {
      tossup: { formattedText },
      powerIndex,
      buzzIndex,
    },
  } = useSelector(selectTossupReader);
  const dispatch = useDispatch();
  const { words, visibleIndex, pause, reveal } = useReader(formattedText);

  // update visible index
  useEffect(() => {
    dispatch(setVisible(visibleIndex));
  }, [dispatch, visibleIndex]);

  // pause reading when answering
  useEffect(() => {
    if (status === ReaderStatus.answering) {
      pause();
    }
  }, [pause, status]);

  // reveal rest of tossup
  useEffect(() => {
    if (status === ReaderStatus.judged) {
      reveal();
    }
  }, [reveal, status]);

  // buzz at the end of the tossup
  useEffect(() => {
    if (visibleIndex === words.length - 1) {
      dispatch(buzz());
    }
  }, [dispatch, visibleIndex, words.length]);

  return (
    <>
      {renderQuestion(words, {
        visible: visibleIndex,
        bold: powerIndex,
        buzz: buzzIndex,
      })}
    </>
  );
};

const Container = () => {
  const { status } = useSelector(selectTossupReader);

  const showLoading = status === ReaderStatus.fetching;
  const showEmpty = status === ReaderStatus.empty;
  const emptyMessage =
    'No tossups found. Try checking your network connection or tweaking the search parameters.';

  return (
    <ReaderQuestion
      showLoading={showLoading}
      showEmpty={showEmpty}
      emptyMessage={emptyMessage}
    >
      <Question />
    </ReaderQuestion>
  );
};

export default Container;
