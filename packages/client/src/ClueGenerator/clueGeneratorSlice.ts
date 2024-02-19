import { FrequencyListEntry, SelectedClue } from '@qbhub/types';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';

const FETCH_LIMIT = 200;

type ClueGeneratorSlice = {
  answers: FrequencyListEntry[] | undefined;
  clues: SelectedClue[] | undefined;
  isFetching: boolean;
};

const initialState: ClueGeneratorSlice = {
  answers: undefined,
  clues: undefined,
  isFetching: false,
};

type FetchAnswersArgs = { answer: string; settings: Settings };
export const fetchAnswers = createAppAsyncThunk<
  FrequencyListEntry[],
  FetchAnswersArgs
>('clueGenerator/fetchAnswers', async ({ answer, settings }) => {
  const fetchParams = { ...settings, answer, limit: FETCH_LIMIT };
  const answers = await fetchUtils.fetchAnswerlines(fetchParams);
  return answers;
});

type FetchCluesArgs = { answer: string; settings: Settings };
export const fetchClues = createAppAsyncThunk<SelectedClue[], FetchCluesArgs>(
  'clueGenerator/fetchClues',
  async ({ answer, settings }) => {
    const fetchParams = { ...settings, answer, limit: FETCH_LIMIT };
    const clues = await fetchUtils.fetchClues(fetchParams);
    return clues;
  },
);

const clueGeneratorSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.isFetching = false;
        state.answers = action.payload;
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isFetching = false;
        state.answers = [];
      });

    builder
      .addCase(fetchClues.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchClues.fulfilled, (state, action) => {
        state.isFetching = false;
        state.clues = action.payload;
      })
      .addCase(fetchClues.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isFetching = false;
        state.clues = [];
      });
  },
  initialState,
  name: 'clueGenerator',
  reducers: {},
});

export const selectClueGenerator = (state: RootState) => state.clueGenerator;

export default clueGeneratorSlice.reducer;
