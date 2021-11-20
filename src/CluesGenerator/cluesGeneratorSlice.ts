import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { Clue } from '../types/tossups';
import * as fetchUtils from '../utils/fetch';

const FETCH_LIMIT = 100;

export enum CluesGeneratorStatus {
  initial,
  loading,
  idle,
}

type CluesGeneratorSlice = {
  status: CluesGeneratorStatus;
  clues: Clue[];
};

const initialState: CluesGeneratorSlice = {
  status: CluesGeneratorStatus.initial,
  clues: [],
};

export const fetchClues = createAsyncThunk<
  Clue[],
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClues.pending, (state) => {
        state.status = CluesGeneratorStatus.loading;
      })
      .addCase(fetchClues.fulfilled, (state, action) => {
        state.status = CluesGeneratorStatus.idle;
        state.clues = action.payload;
      });
  },
});
export const selectCluesGenerator = (state: RootState) => state.cluesGenerator;

export default cluesGeneratorSlice.reducer;
