import {
  Bonus,
  BonusPart,
  BonusPartResult,
  BonusPartScore,
  BonusResult,
} from '@qbhub/types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import * as fetchUtils from '../utils/fetch';
import { ReaderStatus, getBonusScore } from '../utils/reader';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type BonusReaderState = {
  bonuses: Bonus[];
  current: {
    bonus: Bonus;
    buzzIndex: number;
    number: number;
    part: BonusPart;
    partResult: BonusPartResult;
    result: BonusResult;
  };
  results: BonusResult[];
  score: number;
  status: ReaderStatus;
};

const initialState: BonusReaderState = {
  bonuses: [],
  current: {
    bonus: {} as Bonus,
    buzzIndex: -1,
    number: 1,
    part: {} as BonusPart,
    partResult: {} as BonusPartResult,
    result: {
      bonus: {} as Bonus,
      parts: [],
      score: 0,
    },
  },
  results: [],
  score: 0,
  status: ReaderStatus.idle,
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
>(
  'bonusReader/nextBonus',
  async (args, { dispatch, getState }) => {
    const { bonusReader } = getState();
    // if bonus cache is low, fetch more
    // if bonus cache is empty, keep the action pending
    if (bonusReader.bonuses.length === 0) {
      await dispatch(fetchBonuses(args)).unwrap();
    } else if (bonusReader.bonuses.length < 5) {
      dispatch(fetchBonuses(args));
    }
  },
  {
    condition: (_, { getState }) => {
      const { bonusReader } = getState();
      return [
        ReaderStatus.idle,
        ReaderStatus.judged,
        ReaderStatus.empty,
      ].includes(bonusReader.status);
    },
  },
);

const bonusReaderSlice = createSlice({
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
  initialState,
  name: 'bonusReader',
  reducers: {
    buzz: (state, action: PayloadAction<number>) => {
      if (state.status === ReaderStatus.reading) {
        state.status = ReaderStatus.answering;
        state.current.buzzIndex = action.payload;
      }
    },
    filterBonuses: (state, { payload: settings }: PayloadAction<Settings>) => {
      state.bonuses = state.bonuses.filter((bn) =>
        isQuestionValid(bn, settings),
      );
    },
    nextBonusPart: (state) => {
      state.current.buzzIndex = initialState.current.buzzIndex;
      state.current.partResult = initialState.current.partResult;
      state.current.number += 1;
      state.current.part = state.current.bonus.parts[state.current.number - 1];
      state.status = ReaderStatus.reading;
    },
    prompt: (state) => {
      if (
        [ReaderStatus.answering, ReaderStatus.prompting].includes(state.status)
      ) {
        state.status = ReaderStatus.prompting;
      }
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
          score: action.payload.isCorrect
            ? BonusPartScore.ten
            : BonusPartScore.zero,
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
  },
});
export const { buzz, filterBonuses, nextBonusPart, prompt, submitAnswer } =
  bonusReaderSlice.actions;

export const selectBonusReader = (state: RootState) => state.bonusReader;
export const selectIsAnswering = (state: RootState) =>
  [ReaderStatus.answering, ReaderStatus.prompting].includes(
    state.bonusReader.status,
  );

export default bonusReaderSlice.reducer;
