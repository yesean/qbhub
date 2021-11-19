import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { Freq } from '../types/frequencyList';
import * as fetchUtils from '../utils/fetch';
import logger from '../utils/logger';

export const PAGE_SIZE = 20;
export const FETCH_LIMIT = 5 * PAGE_SIZE;

export enum FreqFetchStatus {
  idle,
  active,
}

export enum FreqStatus {
  initial, // the initial state when results and page are empty
  idle,
  loading,
}

type FrequencyListState = {
  status: FreqStatus;
  fetchStatus: FreqFetchStatus;
  results: Freq[];
  page: Freq[];
  offset: number;
};

const initialState: FrequencyListState = {
  status: FreqStatus.initial,
  fetchStatus: FreqFetchStatus.idle,
  results: [],
  page: [],
  offset: 0,
};

export const fetchPages = createAsyncThunk<
  Freq[],
  number,
  { state: RootState }
>(
  'frequencyList/fetchPages',
  async (offset, { getState }) => {
    const { settings } = getState();
    const fetchParams = { ...settings, limit: FETCH_LIMIT, offset };
    const freq = await fetchUtils.fetchFreq(fetchParams);
    return freq;
  },
  {
    condition: (_, { getState }) => {
      const {
        frequencyList: { fetchStatus },
      } = getState();
      return fetchStatus === FreqFetchStatus.idle;
    },
  },
);

export const nextPage = createAsyncThunk<void, undefined, { state: RootState }>(
  'frequencyList/nextPage',
  async (_, { getState, dispatch }) => {
    const {
      frequencyList: { offset, results },
    } = getState();
    if (offset + PAGE_SIZE >= results.length) {
      // if on the last page, wait for fetch
      await dispatch(fetchPages(results.length)).unwrap();
    } else if (offset + 3 * PAGE_SIZE >= results.length) {
      // if 3 pages from the last page, fetch more in the background
      logger.info('Starting to prefetch pages.');
      dispatch(fetchPages(results.length))
        .unwrap()
        .then(() => logger.info('Finished prefetching pages.'))
        .catch((e) => logger.info('Pages prefetch rejected:', e));
    }
  },
);

const frequencyListSlice = createSlice({
  name: 'frequencyList',
  initialState,
  reducers: {
    prevPage: (state) => {
      state.offset = Math.max(0, state.offset - PAGE_SIZE);
      state.page = state.results.slice(state.offset, state.offset + PAGE_SIZE);
    },
    reset: (state) => {
      state.status = FreqStatus.initial;
      state.offset = 0;
      state.page = [];
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => {
        state.fetchStatus = FreqFetchStatus.active;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.results.push(...action.payload);
        state.page = state.results.slice(
          state.offset,
          state.offset + PAGE_SIZE,
        );
        state.fetchStatus = FreqFetchStatus.idle;
        state.status = FreqStatus.idle;
      });
    builder
      .addCase(nextPage.pending, (state) => {
        state.status = FreqStatus.loading;
      })
      .addCase(nextPage.fulfilled, (state) => {
        state.offset += PAGE_SIZE;
        state.page = state.results.slice(
          state.offset,
          state.offset + PAGE_SIZE,
        );
        state.status = FreqStatus.idle;
      })
      .addCase(nextPage.rejected, (state) => {
        state.offset += PAGE_SIZE;
        state.page = state.results.slice(
          state.offset,
          state.offset + PAGE_SIZE,
        );
      });
  },
});
export const selectFrequencyList = (state: RootState) => state.frequencyList;
export const { prevPage, reset } = frequencyListSlice.actions;

export default frequencyListSlice.reducer;
