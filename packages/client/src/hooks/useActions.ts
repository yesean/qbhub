import { useCallback, useMemo } from 'react';
import { nextBonus } from '../BonusReader/bonusReaderSlice';
import {
  fetchAnswers,
  fetchClues,
} from '../CluesGenerator/cluesGeneratorSlice';
import { nextTossup } from '../TossupReader/tossupReaderSlice';
import { useAppDispatch } from '../redux/hooks';
import { useSettings } from './useSettings';

// Hook with common dispatch actions
export default function useActions() {
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const dispatchNextTossup = useCallback(
    () => dispatch(nextTossup({ settings })),
    [dispatch, settings],
  );

  const dispatchNextBonus = useCallback(
    () => dispatch(nextBonus({ settings })),
    [dispatch, settings],
  );

  const dispatchFetchAnswers = useCallback(
    (query: string) => dispatch(fetchAnswers({ answer: query, settings })),
    [dispatch, settings],
  );

  const dispatchFetchClues = useCallback(
    (query: string) => dispatch(fetchClues({ answer: query, settings })),
    [dispatch, settings],
  );

  return useMemo(
    () => ({
      dispatchFetchAnswers,
      dispatchFetchClues,
      dispatchNextBonus,
      dispatchNextTossup,
    }),
    [
      dispatchFetchAnswers,
      dispatchFetchClues,
      dispatchNextBonus,
      dispatchNextTossup,
    ],
  );
}
