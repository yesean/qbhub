import { Bonus, BonusInstance, BonusResult } from '@qbhub/types';
import { isEmpty } from '@qbhub/utils';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import type { AppDispatch, RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import {
  BonusResultsSummary,
  getBonusResultsSummary,
  INITIAL_BONUS_RESULTS_SUMMARY,
} from '../utils/bonus';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type BonusReaderState = BonusResultsSummary & {
  bonusInstances: BonusInstance[] | undefined;
  currentBonusInstance: BonusInstance | undefined;
  isFetching: boolean;
  isUserWaiting: boolean;
  results: BonusResult[];
};

const initialState: BonusReaderState = {
  ...INITIAL_BONUS_RESULTS_SUMMARY,
  bonusInstances: undefined,
  currentBonusInstance: undefined,
  isFetching: false,
  isUserWaiting: false,
  results: [],
};

type FetchBonusesArgs = { settings: Settings };
const fetchBonuses = createAppAsyncThunk<Bonus[], FetchBonusesArgs>(
  'bonusReader/fetchBonuses',
  async ({ settings }) => {
    const bonuses = await fetchUtils.fetchBonuses(settings);
    return bonuses;
  },
);

async function fetchBonusesIfNeeded(
  bonusInstances: BonusInstance[],
  dispatch: AppDispatch,
  args: FetchBonusesArgs,
) {
  if (bonusInstances.length > 5) {
    return;
  }

  const promise = dispatch(fetchBonuses(args));
  if (isEmpty(bonusInstances)) {
    await promise;
  }
}

export const nextBonus = createAppAsyncThunk<void, FetchBonusesArgs>(
  'bonusReader/nextBonus',
  async (args, { dispatch, getState }) => {
    const {
      bonusReader: { bonusInstances },
    } = getState();

    await fetchBonusesIfNeeded(bonusInstances ?? [], dispatch, args);
  },
);

type FilterBonusesArgs = { settings: Settings };
const filterBonuses = createAction<FilterBonusesArgs>(
  'bonusReader/filterBonuses',
);

export const filterBonusesWithRefetch = createAppAsyncThunk<
  void,
  FetchBonusesArgs & FilterBonusesArgs
>('bonusReader/filterBonusesWithRefetch', (args, { dispatch, getState }) => {
  dispatch(filterBonuses(args));

  const {
    bonusReader: { bonusInstances: bonuses },
  } = getState();
  if (bonuses === undefined) {
    return;
  }
  fetchBonusesIfNeeded(bonuses, dispatch, args);
});

const bonusReaderSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchBonuses.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchBonuses.fulfilled, (state, action) => {
        state.isFetching = false;
        const newBonusInstances = action.payload.map((bonus) => ({
          ...bonus,
          instanceID: v4(),
        }));
        state.bonusInstances = [
          ...(state.bonusInstances ?? []),
          ...newBonusInstances,
        ];
      })
      .addCase(fetchBonuses.rejected, (state) => {
        state.isFetching = false;
      });
    builder
      .addCase(nextBonus.pending, (state) => {
        state.isUserWaiting = true;
      })
      .addCase(nextBonus.fulfilled, (state) => {
        state.isUserWaiting = false;
        state.currentBonusInstance = state.bonusInstances?.shift();
      })
      .addCase(nextBonus.rejected, (state) => {
        state.isUserWaiting = false;
      });
    builder.addCase(filterBonuses, (state, { payload: { settings } }) => {
      state.bonusInstances = state.bonusInstances?.filter((bonusInstance) =>
        isQuestionValid(bonusInstance, settings),
      );
    });
  },
  initialState,
  name: 'bonusReader',
  reducers: {
    submitResult(state, action: PayloadAction<BonusResult>) {
      state.results.unshift(action.payload);
    },
    updateResult(state, { payload }: PayloadAction<BonusResult>) {
      const index = state.results.findIndex(
        ({ instanceID }) => instanceID === payload.instanceID,
      );
      if (index === -1) {
        return;
      }

      state.results[index] = payload;
    },
  },
});
export const { submitResult, updateResult } = bonusReaderSlice.actions;

export const selectBonusReader = ({ bonusReader }: RootState) => {
  const isUninitialized =
    bonusReader.bonusInstances === undefined && !bonusReader.isFetching;

  const latestBonusResult = bonusReader.results.at(0);
  const latestBonusPartResult = latestBonusResult?.parts.at(-1);
  const bonusResultsSummary = getBonusResultsSummary(bonusReader.results);

  return {
    ...bonusReader,
    ...bonusResultsSummary,
    isUninitialized,
    latestBonusPartResult,
    latestBonusResult,
  };
};

export default bonusReaderSlice.reducer;
