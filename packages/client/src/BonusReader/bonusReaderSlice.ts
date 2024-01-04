import { Bonus, BonusResult } from '@qbhub/types';
import { isEmpty } from '@qbhub/utils';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type BonusReaderState = {
  bonuses: Bonus[] | undefined;
  currentBonus: Bonus | undefined;
  isFetching: boolean;
  isUserWaiting: boolean;
  results: BonusResult[];
  score: number;
};

const initialState: BonusReaderState = {
  bonuses: undefined,
  currentBonus: undefined,
  isFetching: false,
  isUserWaiting: false,
  results: [],
  score: 0,
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
  bonuses: Bonus[],
  dispatch: AppDispatch,
  args: FetchBonusesArgs,
) {
  if (bonuses.length > 5) {
    return;
  }

  const promise = dispatch(fetchBonuses(args));
  if (isEmpty(bonuses)) {
    await promise;
  }
}

export const nextBonus = createAppAsyncThunk<void, FetchBonusesArgs>(
  'bonusReader/nextBonus',
  async (args, { dispatch, getState }) => {
    const {
      bonusReader: { bonuses },
    } = getState();

    await fetchBonusesIfNeeded(bonuses ?? [], dispatch, args);
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
    bonusReader: { bonuses },
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
        state.bonuses = [...(state.bonuses ?? []), ...action.payload];
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
        state.currentBonus = state.bonuses?.shift();
      })
      .addCase(nextBonus.rejected, (state) => {
        state.isUserWaiting = false;
      });
    builder.addCase(filterBonuses, (state, { payload: { settings } }) => {
      state.bonuses = state.bonuses?.filter((bn) =>
        isQuestionValid(bn, settings),
      );
    });
  },
  initialState,
  name: 'bonusReader',
  reducers: {
    submitResult(state, action: PayloadAction<BonusResult>) {
      state.results.unshift(action.payload);
    },
  },
});
export const { submitResult } = bonusReaderSlice.actions;

export const selectBonusReader = ({ bonusReader }: RootState) => {
  const score = bonusReader.results.reduce(
    (acc, result) => acc + result.score,
    0,
  );
  const isUninitialized =
    bonusReader.bonuses === undefined && !bonusReader.isFetching;

  return { ...bonusReader, isUninitialized, score };
};

export default bonusReaderSlice.reducer;
