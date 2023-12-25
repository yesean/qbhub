import { useCallback, useMemo } from 'react';
import { nextBonus } from '../BonusReader/bonusReaderSlice';
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

  return useMemo(
    () => ({ dispatchNextBonus, dispatchNextTossup }),
    [dispatchNextTossup, dispatchNextBonus],
  );
}
