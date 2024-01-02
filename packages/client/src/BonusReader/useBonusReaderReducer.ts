import { Bonus, BonusPartResult, BonusResult } from '@qbhub/types';
import { useReducer } from 'react';
import { getBonusResult, isLastBonusPart } from '../utils/bonus';

type BonusReaderState = {
  bonusPartNumber: number;
  bonusPartResults: BonusPartResult[];
  bonusResult: BonusResult | undefined;
};

const bonusReaderInitialState: BonusReaderState = {
  bonusPartNumber: 0,
  bonusPartResults: [],
  bonusResult: undefined,
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

      let bonusResult;
      // if on last bonus part, construct a bonus result from bonus part results
      if (isLastBonusPart(state.bonusPartNumber, action.bonus)) {
        bonusResult = getBonusResult(nextBonusPartResults, action.bonus);
      }

      return { ...state, bonusPartResults: nextBonusPartResults, bonusResult };
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
export default function useBonusReaderReducer() {
  return useReducer(bonusReaderReducer, bonusReaderInitialState);
}
