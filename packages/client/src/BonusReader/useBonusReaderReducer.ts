import { BonusInstance, BonusPartResult } from '@qbhub/types';
import { useReducer } from 'react';
import { isLastBonusPart, updateBonusPartResults } from '../utils/bonus';

type BonusReaderState = {
  bonusInstance: BonusInstance;
  bonusPartNumber: number;
  bonusPartResults: BonusPartResult[];
};

const NEW_BONUS_READER_STATE = {
  bonusPartNumber: 0,
  bonusPartResults: [],
};

type BonusReaderAction =
  | {
      bonusPartResult: BonusPartResult;
      type: 'newBonusPartResult';
    }
  | {
      bonusPartResult: BonusPartResult;
      type: 'updateBonusPartResult';
    }
  | {
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
      if (isLastBonusPart(state.bonusPartNumber, state.bonusInstance)) {
        return { ...state, ...NEW_BONUS_READER_STATE };
      }

      const nextBonusPartNumber = state.bonusPartNumber + 1;
      return { ...state, bonusPartNumber: nextBonusPartNumber };
    }
    case 'updateBonusPartResult': {
      const newBonusPartResults = updateBonusPartResults(
        state.bonusPartResults,
        action.bonusPartResult,
      );

      return { ...state, bonusPartResults: newBonusPartResults };
    }
  }
}

// Reducer hook for managing bonus reader state
// State for switching between bonus parts is managed here, while switching between bonuses in managed in redux store
export default function useBonusReaderReducer(initialState: BonusReaderState) {
  return useReducer(bonusReaderReducer, initialState);
}
