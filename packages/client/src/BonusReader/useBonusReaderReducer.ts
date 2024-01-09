import { Bonus, BonusPartResult } from '@qbhub/types';
import { useReducer } from 'react';
import { isLastBonusPart } from '../utils/bonus';

type BonusReaderState = {
  bonusPartNumber: number;
  bonusPartResults: BonusPartResult[];
};

const bonusReaderInitialState: BonusReaderState = {
  bonusPartNumber: 0,
  bonusPartResults: [],
};

type BonusReaderAction =
  | {
      bonus: Bonus;
      bonusPartResult: BonusPartResult;
      type: 'newBonusPartResult';
    }
  | {
      bonus: Bonus;
      type: 'nextBonusPart';
    };

function bonusReaderReducer(
  state: BonusReaderState,
  action: BonusReaderAction,
) {
  switch (action.type) {
    case 'newBonusPartResult': {
      const nextBonusPartResults = [
        ...state.bonusPartResults,
        action.bonusPartResult,
      ];

      return { ...state, bonusPartResults: nextBonusPartResults };
    }
    case 'nextBonusPart': {
      // if on last bonus part, reset state
      if (isLastBonusPart(state.bonusPartNumber, action.bonus)) {
        return bonusReaderInitialState;
      }

      const nextBonusPartNumber = state.bonusPartNumber + 1;
      return { ...state, bonusPartNumber: nextBonusPartNumber };
    }
  }
}

// Reducer hook for managing bonus reader state
// State for switching between bonus parts is managed here, while switching between bonuses in managed in redux store
export default function useBonusReaderReducer(initialState?: BonusReaderState) {
  return useReducer(
    bonusReaderReducer,
    initialState ?? bonusReaderInitialState,
  );
}
