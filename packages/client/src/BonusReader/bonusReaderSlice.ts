import { Bonus, BonusResult } from '@qbhub/types';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type BonusReaderState = {
  bonuses: Bonus[] | undefined;
  isFetching: boolean;
  results: BonusResult[];
  score: number;
};

const initialState: BonusReaderState = {
  bonuses: undefined,
  isFetching: false,
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
  // if bonus cache is low, fetch more
  // if bonus cache is empty, keep the action pending
  if (bonuses.length === 0) {
    await dispatch(fetchBonuses(args)).unwrap();
  } else if (bonuses.length < 5) {
    dispatch(fetchBonuses(args));
  }
}

export const nextBonus = createAppAsyncThunk<void, FetchBonusesArgs>(
  'bonusReader/nextBonus',
  async (args, { dispatch, getState }) => {
    const {
      bonusReader: { bonuses },
    } = getState();

    if (bonuses === undefined) {
      await dispatch(fetchBonuses(args)).unwrap();
      return;
    }
    fetchBonusesIfNeeded(bonuses, dispatch, args);
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
    builder.addCase(fetchBonuses.fulfilled, (state, action) => {
      state.bonuses = [...(state.bonuses ?? []), ...action.payload];
    });
    builder
      .addCase(nextBonus.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(nextBonus.fulfilled, (state) => {
        state.isFetching = false;
        state.bonuses?.shift();
      })
      .addCase(nextBonus.rejected, (state) => {
        state.isFetching = false;
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
      state.results.push(action.payload);
    },
  },
});
export const { submitResult } = bonusReaderSlice.actions;

export const selectBonusReader = ({ bonusReader }: RootState) => {
  const score = bonusReader.results.reduce(
    (acc, result) => acc + result.score,
    0,
  );

  const currentBonus = bonusReader.bonuses?.at(0);

  return { ...bonusReader, currentBonus, score };
};

export default bonusReaderSlice.reducer;
