import { FrequencyListEntry, SelectedClue } from '@qbhub/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import * as fetchUtils from '../utils/fetch';

const FETCH_LIMIT = 200;

export enum CluesGeneratorStatus {
  initial,
  loading,
  loaded,
}

type CluesGeneratorSlice = {
  status: CluesGeneratorStatus;
  clues: SelectedClue[];
  answers: FrequencyListEntry[];
  selectedAnswer: string;
  currentQuery: string;
};

const initialState: CluesGeneratorSlice = {
  status: CluesGeneratorStatus.initial,
  clues: [],
  answers: [],
  selectedAnswer: '',
  currentQuery: '',
};

export const fetchAnswers = createAsyncThunk<
  FrequencyListEntry[],
  string,
  { state: RootState }
>(
  'cluesGenerator/fetchAnswers',
  async (answer, { getState }) => {
    const { settings } = getState();
    const fetchParams = { ...settings, answer, limit: FETCH_LIMIT };
    const answers = await fetchUtils.fetchAnswers(fetchParams);
    return answers;
  },
  {
    condition: (_, { getState }) => {
      const {
        cluesGenerator: { status },
      } = getState();
      return status !== CluesGeneratorStatus.loading;
    },
  },
);
export const fetchClues = createAsyncThunk<
  SelectedClue[],
  string,
  { state: RootState }
>(
  'cluesGenerator/fetchClues',
  async (answer, { getState }) => {
    const { settings } = getState();
    const fetchParams = { ...settings, answer, limit: FETCH_LIMIT };
    const clues = await fetchUtils.fetchClues(fetchParams);
    return clues;
  },
  {
    condition: (_, { getState }) => {
      const {
        cluesGenerator: { status },
      } = getState();
      return status !== CluesGeneratorStatus.loading;
    },
  },
);

const cluesGeneratorSlice = createSlice({
  name: 'cluesGenerator',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = CluesGeneratorStatus.initial;
    },
    selectAnswer: (state, action: PayloadAction<string>) => {
      state.selectedAnswer = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.status = CluesGeneratorStatus.loading;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.status = CluesGeneratorStatus.loaded;
        state.answers = action.payload;
      });
    builder
      .addCase(fetchClues.pending, (state) => {
        state.status = CluesGeneratorStatus.loading;
      })
      .addCase(fetchClues.fulfilled, (state, action) => {
        state.status = CluesGeneratorStatus.loaded;
        state.clues = action.payload;
      });
  },
});
export const { resetStatus, selectAnswer, setQuery } =
  cluesGeneratorSlice.actions;
export const selectCluesGenerator = (state: RootState) => state.cluesGenerator;

export default cluesGeneratorSlice.reducer;
