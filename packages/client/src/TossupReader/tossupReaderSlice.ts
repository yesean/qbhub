import { Tossup, TossupResult, TossupWord } from '@qbhub/types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import * as fetchUtils from '../utils/fetch';
import {
  ReaderStatus,
  getPowerIndex,
  getTossupScore,
  getTossupWords,
} from '../utils/reader';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type TossupReaderState = {
  current: {
    buzzIndex: number;
    powerIndex: number;
    result: TossupResult;
    tossup: Tossup;
    tossupWords: TossupWord[];
  };
  results: TossupResult[];
  score: number;
  status: ReaderStatus;
  tossups: Tossup[];
};

const initialState: TossupReaderState = {
  current: {
    buzzIndex: -1,
    powerIndex: -1,
    result: {} as TossupResult,
    tossup: {} as Tossup,
    tossupWords: [],
  },
  results: [],
  score: 0,
  status: ReaderStatus.idle,
  tossups: [],
};

const fetchTossups = createAsyncThunk<Tossup[], { settings: Settings }>(
  'tossupReader/fetchTossups',
  async ({ settings }) => {
    const tossups = await fetchUtils.fetchTossups(settings);
    return tossups;
  },
);

export const nextTossup = createAsyncThunk<
  void,
  { settings: Settings },
  { state: RootState }
>('tossupReader/nextTossup', async (args, { dispatch, getState }) => {
  const { tossupReader } = getState();
  // if tossup cache is low, fetch more
  // if tossup cache is empty, keep the action pending
  if (tossupReader.tossups.length === 0) {
    await dispatch(fetchTossups(args)).unwrap();
  } else if (tossupReader.tossups.length < 5) {
    dispatch(fetchTossups(args));
  }
});

const tossupReaderSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchTossups.fulfilled, (state, action) => {
      state.tossups.push(...action.payload);
    });
    builder
      .addCase(nextTossup.pending, (state) => {
        state.status = ReaderStatus.fetching;
        state.current = initialState.current;
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
  initialState,
  name: 'tossupReader',
  reducers: {
    buzz: (state, action: PayloadAction<number>) => {
      if (state.status === ReaderStatus.reading) {
        state.status = ReaderStatus.answering;
        state.current.buzzIndex = action.payload;
      }
    },
    filterTossups: (state, { payload: settings }: PayloadAction<Settings>) => {
      state.tossups = state.tossups.filter((tu) =>
        isQuestionValid(tu, settings),
      );
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
          buzzIndex: state.current.buzzIndex,
          score,
          tossup: state.current.tossup,
          words: state.current.tossupWords,
        };

        state.results.unshift(state.current.result);
        state.score += score;
      }
    },
    submitResult: (state, action: PayloadAction<TossupResult>) => {
      state.results.push(action.payload);
    },
  },
});
export const { buzz, filterTossups, prompt, submitAnswer, submitResult } =
  tossupReaderSlice.actions;

export const selectTossupReader = (state: RootState) => state.tossupReader;
export const selectIsAnswering = (state: RootState) =>
  [ReaderStatus.answering, ReaderStatus.prompting].includes(
    state.tossupReader.status,
  );

export default tossupReaderSlice.reducer;
