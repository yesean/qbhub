import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { Bonus, BonusPart, BonusPartResult, BonusResult } from '../types/bonus';
import { Category, Difficulty, Subcategory } from '../types/questions';
import * as fetchUtils from '../utils/fetch';
import { getBonusScore } from '../utils/reader';

export enum ReaderStatus {
  idle,
  fetching,
  reading,
  answering,
  partialJudged,
  prompting,
  judged,
  empty,
}

type BonusReaderState = {
  status: ReaderStatus;
  bonuses: Bonus[];
  results: BonusResult[];
  score: number;
  current: {
    number: number;
    part: BonusPart;
    partResult: BonusPartResult;
    bonus: Bonus;
    result: BonusResult;
    buzzIndex: number;
    visibleIndex: number;
  };
};

const initialState: BonusReaderState = {
  status: ReaderStatus.idle,
  bonuses: [],
  results: [],
  score: 0,
  current: {
    number: 1,
    part: {} as BonusPart,
    partResult: {} as BonusPartResult,
    bonus: {} as Bonus,
    result: {
      score: 0,
      parts: [],
      bonus: {} as Bonus,
    },
    buzzIndex: -1,
    visibleIndex: -1,
  },
};

export const fetchBonuses = createAsyncThunk<
  Bonus[],
  undefined,
  { state: RootState }
>('bonusReader/fetchBonuses', async (_, { getState }) => {
  const { settings } = getState();
  const bonuses = await fetchUtils.fetchBonuses(settings);
  return bonuses;
});

export const nextBonus = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>(
  'bonusReader/nextBonus',
  async (_, { dispatch, getState }) => {
    const { bonusReader } = getState();
    // if bonus cache is low, fetch more
    // if bonus cache is empty, keep the action pending
    if (bonusReader.bonuses.length === 0) {
      await dispatch(fetchBonuses()).unwrap();
    } else if (bonusReader.bonuses.length < 5) {
      dispatch(fetchBonuses());
    }
  },
  {
    condition: (_, { getState }) => {
      const { bonusReader } = getState();
      return [ReaderStatus.idle, ReaderStatus.judged].includes(
        bonusReader.status,
      );
    },
  },
);

const bonusReaderSlice = createSlice({
  name: 'bonusReader',
  initialState,
  reducers: {
    buzz: (state) => {
      if (state.status === ReaderStatus.reading) {
        state.status = ReaderStatus.answering;
        state.current.buzzIndex = state.current.visibleIndex;
      }
    },
    prompt: (state) => {
      if (
        [ReaderStatus.answering, ReaderStatus.prompting].includes(state.status)
      ) {
        state.status = ReaderStatus.prompting;
      }
    },
    setVisible: (state, action: PayloadAction<number>) => {
      state.current.visibleIndex = action.payload;
    },
    nextBonusPart: (state) => {
      state.current.buzzIndex = initialState.current.buzzIndex;
      state.current.visibleIndex = initialState.current.visibleIndex;
      state.current.partResult = initialState.current.partResult;
      state.current.number += 1;
      state.current.part = state.current.bonus.parts[state.current.number - 1];
      state.status = ReaderStatus.reading;
    },
    submitAnswer: (
      state,
      action: PayloadAction<{
        isCorrect: boolean;
        userAnswer: string;
      }>,
    ) => {
      if (
        state.status === ReaderStatus.answering ||
        state.status === ReaderStatus.prompting
      ) {
        state.status = ReaderStatus.partialJudged;

        const partResult = {
          ...action.payload,
          buzzIndex: state.current.buzzIndex,
          number: state.current.number,
        };
        state.current.partResult = partResult;
        state.current.result.parts.push(partResult);

        if (state.current.number === 3) {
          const score = getBonusScore(state.current.result.parts);
          state.current.result.score = score;
          state.score += score;
          state.results.unshift(state.current.result);
          state.status = ReaderStatus.judged;
        }
      }
    },
    filterBonusesByCategory: (state, action: PayloadAction<Category[]>) => {
      state.bonuses = state.bonuses.filter((bn) =>
        action.payload.includes(bn.category),
      );
    },
    filterBonusesBySubcategory: (
      state,
      action: PayloadAction<Subcategory[]>,
    ) => {
      state.bonuses = state.bonuses.filter((bn) =>
        action.payload.includes(bn.subcategory),
      );
    },
    filterBonusesByDifficulties: (
      state,
      action: PayloadAction<Difficulty[]>,
    ) => {
      state.bonuses = state.bonuses.filter((bn) =>
        action.payload.includes(bn.difficulty),
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBonuses.fulfilled, (state, action) => {
      state.bonuses.push(...action.payload);
    });
    builder
      .addCase(nextBonus.pending, (state) => {
        state.status = ReaderStatus.fetching;
      })
      .addCase(nextBonus.fulfilled, (state) => {
        if (state.bonuses.length === 0) {
          state.status = ReaderStatus.empty;
        } else {
          // reset current
          state.current = {
            ...initialState.current,
            result: { ...initialState.current.result },
          };

          // initialize current
          const currentBonus = state.bonuses.shift() as Bonus;
          state.current.bonus = currentBonus;
          state.current.result.bonus = state.current.bonus;
          [state.current.part] = state.current.bonus.parts;

          state.status = ReaderStatus.reading;
        }
      });
  },
});
export const {
  buzz,
  prompt,
  setVisible,
  submitAnswer,
  nextBonusPart,
  filterBonusesByCategory,
  filterBonusesBySubcategory,
  filterBonusesByDifficulties,
} = bonusReaderSlice.actions;

export const selectBonusReader = (state: RootState) => state.bonusReader;
export const selectIsAnswering = (state: RootState) =>
  [ReaderStatus.answering, ReaderStatus.prompting].includes(
    state.bonusReader.status,
  );

export default bonusReaderSlice.reducer;
