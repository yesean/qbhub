import { FormattedWord, Tossup, TossupResult } from '@qbhub/types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import * as fetchUtils from '../utils/fetch';
import {
  ReaderStatus,
  getFormattedWords,
  getPowerIndex,
  getTossupScore,
} from '../utils/reader';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type CurrentTossupState = {
  buzzIndex: number;
  formattedWords: FormattedWord[];
  powerIndex: number;
  tossup: Tossup;
};

type TossupReaderState = {
  current: CurrentTossupState | null;
  isFetching: boolean;
  results: TossupResult[];
  score: number;
  status: ReaderStatus;
  tossups: Tossup[];
};

const initialState: TossupReaderState = {
  current: null,
  isFetching: false,
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
        state.isFetching = true;
        state.status = ReaderStatus.fetching;
        state.current = initialState.current;
      })
      .addCase(nextTossup.fulfilled, (state) => {
        state.isFetching = false;
        const nextCurrentTossup = state.tossups.shift();
        if (nextCurrentTossup === undefined) {
          state.status = ReaderStatus.empty;
          return;
        }

        const formattedWords = getFormattedWords(
          nextCurrentTossup.formattedText,
        );
        state.current = {
          buzzIndex: -1,
          formattedWords,
          powerIndex: getPowerIndex(formattedWords),
          tossup: nextCurrentTossup,
        };
        state.status = ReaderStatus.reading;
      })
      .addCase(nextTossup.rejected, (state) => {
        state.isFetching = false;
      });
  },
  initialState,
  name: 'tossupReader',
  reducers: {
    buzz: (state, action: PayloadAction<number>) => {
      if (state.status === ReaderStatus.reading && state.current != null) {
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
        if (state.current === null) return;

        state.status = ReaderStatus.judged;

        const score = getTossupScore(
          action.payload.isCorrect,
          state.current.buzzIndex <= state.current.powerIndex,
          state.current.buzzIndex === state.current.formattedWords.length - 1,
        );
        const result = {
          ...action.payload,
          buzzIndex: state.current.buzzIndex,
          formattedWords: state.current.formattedWords,
          score,
          tossup: state.current.tossup,
        };

        state.results.unshift(result);
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

export const selectTossupReader = ({ tossupReader }: RootState) => {
  const score = tossupReader.results.reduce(
    (acc, result) => acc + result.score,
    0,
  );

  return { ...tossupReader, score };
};
export const selectIsAnswering = (state: RootState) =>
  [ReaderStatus.answering, ReaderStatus.prompting].includes(
    state.tossupReader.status,
  );

export default tossupReaderSlice.reducer;
