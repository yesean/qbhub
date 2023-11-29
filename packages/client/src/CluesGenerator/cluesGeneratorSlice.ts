import { FrequencyListEntry, SelectedClue } from '@qbhub/types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';

const FETCH_LIMIT = 200;

export enum CluesGeneratorStatus {
  initial,
  loading,
  loaded,
}

type CluesGeneratorSlice = {
  answers: FrequencyListEntry[];
  clues: SelectedClue[];
  currentQuery: string;
  selectedAnswer: string;
  status: CluesGeneratorStatus;
};

const initialState: CluesGeneratorSlice = {
  answers: [],
  clues: [],
  currentQuery: '',
  selectedAnswer: '',
  status: CluesGeneratorStatus.initial,
};

export const fetchAnswers = createAsyncThunk<
  FrequencyListEntry[],
  { answer: string; settings: Settings },
  { state: RootState }
>(
  'cluesGenerator/fetchAnswers',
  async (args) => {
    const fetchParams = { ...args, limit: FETCH_LIMIT };
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
  { answer: string; settings: Settings },
  { state: RootState }
>(
  'cluesGenerator/fetchClues',
  async (args) => {
    const fetchParams = { ...args, limit: FETCH_LIMIT };
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
  initialState,
  name: 'cluesGenerator',
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
});
export const { resetStatus, selectAnswer, setQuery } =
  cluesGeneratorSlice.actions;
export const selectCluesGenerator = (state: RootState) => state.cluesGenerator;

export default cluesGeneratorSlice.reducer;
