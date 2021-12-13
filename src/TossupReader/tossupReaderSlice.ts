import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { Category, Difficulty, Subcategory } from '../types/questions';
import { Tossup, TossupResult } from '../types/tossups';
import * as fetchUtils from '../utils/fetch';
import {
  getCleanedWords,
  getPowerIndex,
  getTossupScore,
} from '../utils/reader';

export enum ReaderStatus {
  idle,
  fetching,
  reading,
  answering,
  prompting,
  judged,
  empty,
}

type TossupReaderState = {
  status: ReaderStatus;
  tossups: Tossup[];
  results: TossupResult[];
  score: number;
  current: {
    tossup: Tossup;
    result: TossupResult;
    powerIndex: number;
    buzzIndex: number;
    visibleIndex: number;
    words: string[];
  };
};

const initialState: TossupReaderState = {
  status: ReaderStatus.idle,
  tossups: [],
  results: [],
  score: 0,
  current: {
    tossup: {} as Tossup,
    result: {} as TossupResult,
    visibleIndex: -1,
    buzzIndex: -1,
    powerIndex: -1,
    words: [],
  },
};

export const fetchTossups = createAsyncThunk<
  Tossup[],
  undefined,
  { state: RootState }
>('tossupReader/fetchTossups', async (_, { getState }) => {
  const { settings } = getState();
  const tossups = await fetchUtils.fetchTossups(settings);
  return tossups;
});

export const nextTossup = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>(
  'tossupReader/nextTossup',
  async (_, { dispatch, getState }) => {
    const { tossupReader } = getState();
    // if tossup cache is low, fetch more
    // if tossup cache is empty, keep the action pending
    if (tossupReader.tossups.length === 0) {
      await dispatch(fetchTossups()).unwrap();
    } else if (tossupReader.tossups.length < 5) {
      dispatch(fetchTossups());
    }
  },
  {
    condition: (_, { getState }) => {
      const { tossupReader } = getState();
      return [ReaderStatus.idle, ReaderStatus.judged].includes(
        tossupReader.status,
      );
    },
  },
);

const tossupReaderSlice = createSlice({
  name: 'tossupReader',
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
        state.status = ReaderStatus.judged;

        const score = getTossupScore(
          action.payload.isCorrect,
          state.current.buzzIndex <= state.current.powerIndex,
        );
        state.current.result = {
          ...state.current.result,
          ...action.payload,
          score,
          buzzIndex: state.current.buzzIndex,
          powerIndex: state.current.powerIndex,
          words: state.current.words,
          tossup: state.current.tossup,
        };

        state.results.unshift(state.current.result);
        state.score += score;
      }
    },
    filterTossupsByCategory: (state, action: PayloadAction<Category[]>) => {
      state.tossups = state.tossups.filter((tu) =>
        action.payload.includes(tu.category),
      );
    },
    filterTossupsBySubcategory: (
      state,
      action: PayloadAction<Subcategory[]>,
    ) => {
      state.tossups = state.tossups.filter((tu) =>
        action.payload.includes(tu.subcategory),
      );
    },
    filterTossupsByDifficulties: (
      state,
      action: PayloadAction<Difficulty[]>,
    ) => {
      state.tossups = state.tossups.filter((tu) =>
        action.payload.includes(tu.difficulty),
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTossups.fulfilled, (state, action) => {
      state.tossups.push(...action.payload);
    });
    builder
      .addCase(nextTossup.pending, (state) => {
        state.status = ReaderStatus.fetching;
      })
      .addCase(nextTossup.fulfilled, (state) => {
        if (state.tossups.length === 0) {
          state.status = ReaderStatus.empty;
        } else {
          state.current = { ...initialState.current };
          [state.current.tossup] = state.tossups;
          state.current.powerIndex = getPowerIndex(
            state.current.tossup.formattedText,
          );
          state.current.words = getCleanedWords(
            state.current.tossup.formattedText,
          );
          state.tossups.shift();
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
  filterTossupsByCategory,
  filterTossupsBySubcategory,
  filterTossupsByDifficulties,
} = tossupReaderSlice.actions;

export const selectTossupReader = (state: RootState) => state.tossupReader;

export default tossupReaderSlice.reducer;
