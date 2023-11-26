import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  nextTossup,
  selectTossupReader,
} from '../TossupReader/tossupReaderSlice';
import QuestionReader from '../components/QuestionReader';
import TealButton from '../components/buttons/TealButton';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';

export default () => {
  const {
    current: { tossup },
  } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const handleNextTossup = useCallback(
    () => dispatch(nextTossup({ settings })),
    [dispatch, settings],
  );

  if (tossup.id === undefined) {
    return (
      <TealButton onClick={handleNextTossup}>click for tossups</TealButton>
    );
  }

  return <QuestionReader question={tossup} onNextQuestion={handleNextTossup} />;
};
