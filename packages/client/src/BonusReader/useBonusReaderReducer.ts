import { Bonus, BonusPartResult, BonusResult } from '@qbhub/types';
import { useReducer } from 'react';
import { getBonusResult } from '../utils/reader';

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
      payload: { bonus: Bonus };
      type: 'next_bonus_part';
    }
  | {
      payload: { bonus: Bonus; bonusPartResult: BonusPartResult };
      type: 'new_bonus_part_result';
    };

function bonusReaderReducer(
  state: BonusReaderState,
  action: BonusReaderAction,
) {
  switch (action.type) {
    case 'new_bonus_part_result': {
      const nextBonusPartResults = [
        ...state.bonusPartResults,
        action.payload.bonusPartResult,
      ];

      let bonusResult;
      if (state.bonusPartNumber === action.payload.bonus.parts.length - 1) {
        bonusResult = getBonusResult(
          nextBonusPartResults,
          action.payload.bonus,
        );
      }

      return { ...state, bonusPartResults: nextBonusPartResults, bonusResult };
    }
    case 'next_bonus_part': {
      if (state.bonusPartNumber === action.payload.bonus.parts.length - 1) {
        return bonusReaderInitialState;
      }

      const nextBonusPartNumber = state.bonusPartNumber + 1;
      const currentBonusPart = action.payload.bonus.parts[nextBonusPartNumber];
      return {
        ...state,
        bonusPartNumber: nextBonusPartNumber,
        currentBonusPart,
      };
    }
  }
}

// Reducer hook for managing bonus reader state
// State for switching between bonus parts is managed here, while switching between bonuses in managed in redux store
export default function useBonusReaderReducer() {
  return useReducer(bonusReaderReducer, bonusReaderInitialState);
}
