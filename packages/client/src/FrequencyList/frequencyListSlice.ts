import { FrequencyListEntry } from '@qbhub/types';
import { Err, Result, makeErr, makeOk, matchResult } from '@qbhub/utils';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import * as fetchUtils from '../utils/fetch';
import { FetchFreqErr } from '../utils/fetch';
import { Settings } from '../utils/settings/types';

type FrequencyListState = {
  hasMoreEntries: boolean;
  isFetching: boolean;
  results: FrequencyListEntry[] | undefined;
};

const initialState: FrequencyListState = {
  hasMoreEntries: true,
  isFetching: false,
  results: undefined,
};

export const FREQUENCY_LIST_PAGE_SIZE = 20;

type NoMoreEntriesErr = Err<{ errType: 'NoMoreEntriesErr' }>;

export type FetchPagesArgs = {
  limit: number;
  offset: number;
  settings: Settings;
};
export const fetchPages = createAppAsyncThunk<
  Result<{ newEntries: FrequencyListEntry[] }, FetchFreqErr | NoMoreEntriesErr>,
  FetchPagesArgs
>(
  'frequencyList/fetchPages',
  async ({ limit, offset, settings }, { getState }) => {
    const fetchParams = { ...settings, limit, offset };
    if (!getState().frequencyList.hasMoreEntries) {
      return makeErr({
        errType: 'NoMoreEntriesErr' as const,
      });
    }

    const fetchFreqResult = await fetchUtils.fetchFreq(fetchParams);
    return matchResult(fetchFreqResult, ({ entries }) => {
      const {
        frequencyList: { results },
      } = getState();
      const seenAnswerlines = new Set(results?.map(({ answer }) => answer));
      const newEntries = entries.filter(
        ({ answer }) => !seenAnswerlines.has(answer),
      );

      if (newEntries.length === 0) {
        return makeErr({
          errType: 'NoMoreEntriesErr' as const,
        });
      }
      return makeOk({ newEntries });
    });
  },
);

const frequencyListSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchPages.fulfilled, (state, { payload }) => {
        matchResult(
          payload,
          ({ newEntries }) => {
            state.results = [...(state.results ?? []), ...newEntries];
            state.isFetching = false;
          },
          (err) => {
            if (err.errType === 'NoMoreEntriesErr') {
              state.hasMoreEntries = false;
            }
            state.isFetching = false;
          },
        );
      });
  },
  initialState,
  name: 'frequencyList',
  reducers: {
    reset() {
      return initialState;
    },
  },
});

export const selectFrequencyList = ({ frequencyList }: RootState) => {
  const { hasMoreEntries, results } = frequencyList;

  const maximumOffset =
    hasMoreEntries || results === undefined
      ? undefined
      : results.length - FREQUENCY_LIST_PAGE_SIZE;

  const hasNoEntries = results === undefined && !hasMoreEntries;

  return { ...frequencyList, hasNoEntries, maximumOffset };
};

export const { reset } = frequencyListSlice.actions;
export default frequencyListSlice.reducer;
