import { Tossup, TossupResult, TossupWord } from '@qbhub/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import * as fetchUtils from '../utils/fetch';
import {
  getPowerIndex,
  getTossupScore,
  getTossupWords,
  ReaderStatus,
} from '../utils/reader';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type TossupReaderState = {
  status: ReaderStatus;
  tossups: Tossup[];
  results: TossupResult[];
  score: number;
  current: {
    tossup: Tossup;
    result: TossupResult;
    buzzIndex: number;
    powerIndex: number;
    tossupWords: TossupWord[];
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
    buzzIndex: -1,
    powerIndex: -1,
    tossupWords: [],
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
      return [
        ReaderStatus.idle,
        ReaderStatus.judged,
        ReaderStatus.empty,
      ].includes(tossupReader.status);
    },
  },
);

const tossupReaderSlice = createSlice({
  name: 'tossupReader',
  initialState,
  reducers: {
    buzz: (state, action: PayloadAction<number>) => {
      if (state.status === ReaderStatus.reading) {
        state.status = ReaderStatus.answering;
        state.current.buzzIndex = action.payload;
      }
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
        state.status = ReaderStatus.judged;

        const score = getTossupScore(
          action.payload.isCorrect,
          state.current.buzzIndex <= state.current.powerIndex,
          state.current.buzzIndex === state.current.tossupWords.length - 1,
        );
        state.current.result = {
          ...action.payload,
          score,
          buzzIndex: state.current.buzzIndex,
          words: state.current.tossupWords,
          tossup: state.current.tossup,
        };

        state.results.unshift(state.current.result);
        state.score += score;
      }
    },
    filterTossups: (state, { payload: settings }: PayloadAction<Settings>) => {
      state.tossups = state.tossups.filter((tu) =>
        isQuestionValid(tu, settings),
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
          state.current.tossupWords = getTossupWords(
            state.current.tossup.formattedText,
          );
          state.current.powerIndex = getPowerIndex(state.current.tossupWords);
          state.tossups.shift();
          state.status = ReaderStatus.reading;
        }
      });
  },
});
export const { buzz, prompt, submitAnswer, filterTossups } =
  tossupReaderSlice.actions;

export const selectTossupReader = (state: RootState) => state.tossupReader;
export const selectIsAnswering = (state: RootState) =>
  [ReaderStatus.answering, ReaderStatus.prompting].includes(
    state.tossupReader.status,
  );

export default tossupReaderSlice.reducer;
