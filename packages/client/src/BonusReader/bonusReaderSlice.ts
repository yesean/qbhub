import { Bonus, BonusResult } from '@qbhub/types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type BonusReaderState = {
  bonuses: Bonus[];
  isFetching: boolean;
  results: BonusResult[];
  score: number;
};

const initialState: BonusReaderState = {
  bonuses: [],
  isFetching: false,
  results: [],
  score: 0,
};

const fetchBonuses = createAsyncThunk<
  Bonus[],
  { settings: Settings },
  { state: RootState }
>('bonusReader/fetchBonuses', async ({ settings }) => {
  const bonuses = await fetchUtils.fetchBonuses(settings);
  return bonuses;
});

export const nextBonus = createAsyncThunk<
  void,
  { settings: Settings },
  { state: RootState }
>('bonusReader/nextBonus', async (args, { dispatch, getState }) => {
  const { bonusReader } = getState();
  // if bonus cache is low, fetch more
  // if bonus cache is empty, keep the action pending
  if (bonusReader.bonuses.length === 0) {
    await dispatch(fetchBonuses(args)).unwrap();
  } else if (bonusReader.bonuses.length < 5) {
    dispatch(fetchBonuses(args));
  }
});

const bonusReaderSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchBonuses.fulfilled, (state, action) => {
      state.bonuses.push(...action.payload);
    });
    builder
      .addCase(nextBonus.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(nextBonus.fulfilled, (state) => {
        state.isFetching = false;
        state.bonuses.shift();
      })
      .addCase(nextBonus.rejected, (state) => {
        state.isFetching = false;
      });
  },
  initialState,
  name: 'bonusReader',
  reducers: {
    filterBonuses: (state, { payload: settings }: PayloadAction<Settings>) => {
      state.bonuses = state.bonuses.filter((bn) =>
        isQuestionValid(bn, settings),
      );
    },
    submitResult(state, action: PayloadAction<BonusResult>) {
      state.results.push(action.payload);
    },
  },
});
export const { filterBonuses, submitResult } = bonusReaderSlice.actions;

export const selectBonusReader = ({ bonusReader }: RootState) => {
  const score = bonusReader.results.reduce(
    (acc, result) => acc + result.score,
    0,
  );

  const currentBonus = bonusReader.bonuses.at(0);

  return { ...bonusReader, currentBonus, score };
};

export default bonusReaderSlice.reducer;
