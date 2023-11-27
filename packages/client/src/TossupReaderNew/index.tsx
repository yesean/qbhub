import { TossupResult } from '@qbhub/types';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  nextTossup,
  selectTossupReader,
  submitResult,
} from '../TossupReader/tossupReaderSlice';
import QuestionReader from '../components/QuestionReader';
import TealButton from '../components/buttons/TealButton';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';

export default () => {
  const { current, results } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const handleNextTossup = useCallback(
    () => dispatch(nextTossup({ settings })),
    [dispatch, settings],
  );

  const handleTossupResult = useCallback(
    (result: TossupResult) => dispatch(submitResult(result)),
    [dispatch],
  );

  const isTossupMissing = current.tossup.id === undefined;
  if (isTossupMissing) {
    return (
      <TealButton onClick={handleNextTossup}>click for tossups</TealButton>
    );
  }

  return (
    <QuestionReader
      question={current.tossup}
      previousResults={results}
      onNextQuestion={handleNextTossup}
      onJudged={handleTossupResult}
    />
  );
};
