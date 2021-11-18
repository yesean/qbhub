import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { Freq } from '../types/frequencyList';
import * as fetchUtils from '../utils/fetch';

export const PAGE_SIZE = 20;
export const FETCH_LIMIT = 5 * PAGE_SIZE;

export enum FreqStatus {
  initial, // the initial state when results and page are empty
  loading,
  idle,
}

type FrequencyListState = {
  status: FreqStatus;
  results: Freq[];
  page: Freq[];
  offset: number;
};

const initialState: FrequencyListState = {
  status: FreqStatus.initial,
  results: [],
  page: [],
  offset: 0,
};

export const fetchFreq = createAsyncThunk<Freq[], number, { state: RootState }>(
  'frequencyList/fetchFreq',
  async (offset, { getState }) => {
    const { settings } = getState();
    const fetchParams = { ...settings, limit: FETCH_LIMIT, offset };
    const freq = await fetchUtils.fetchFreq(fetchParams);
    return freq;
  },
);

// similar to fetchFreq, but sets the page post fetch
export const initialFetchFreq = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('frequencyList/initialFetchFreq', async (_, { dispatch }) => {
  await dispatch(fetchFreq(0)).unwrap();
});

export const nextFreq = createAsyncThunk<void, undefined, { state: RootState }>(
  'frequencyList/nextFreq',
  async (_, { getState, dispatch }) => {
    const {
      frequencyList: { offset, results },
    } = getState();
    if (offset + PAGE_SIZE >= results.length) {
      // if on the last page, wait for fetch
      await dispatch(fetchFreq(results.length)).unwrap();
    } else if (offset + 3 * PAGE_SIZE >= results.length) {
      // if 3 pages from the last page, fetch more in the background
      dispatch(fetchFreq(results.length)).unwrap();
    }
  },
);

const frequencyListSlice = createSlice({
  name: 'frequencyList',
  initialState,
  reducers: {
    prevFreq: (state) => {
      state.offset = Math.max(0, state.offset - PAGE_SIZE);
      state.page = state.results.slice(state.offset, state.offset + PAGE_SIZE);
    },
    resetFreq: (state) => {
      state.status = FreqStatus.initial;
      state.offset = 0;
      state.page = [];
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFreq.fulfilled, (state, action) => {
      state.results.push(...action.payload);
      state.page = state.results.slice(state.offset, state.offset + PAGE_SIZE);
    });
    builder
      .addCase(nextFreq.pending, (state) => {
        state.status = FreqStatus.loading;
      })
      .addCase(nextFreq.fulfilled, (state) => {
        state.offset += PAGE_SIZE;
        state.page = state.results.slice(
          state.offset,
          state.offset + PAGE_SIZE,
        );
        state.status = FreqStatus.idle;
      });
    builder
      .addCase(initialFetchFreq.pending, (state) => {
        state.status = FreqStatus.loading;
      })
      .addCase(initialFetchFreq.fulfilled, (state) => {
        state.page = state.results.slice(
          state.offset,
          state.offset + PAGE_SIZE,
        );
        state.status = FreqStatus.idle;
      });
  },
});
export const selectFrequencyList = (state: RootState) => state.frequencyList;
export const { prevFreq, resetFreq } = frequencyListSlice.actions;

export default frequencyListSlice.reducer;
