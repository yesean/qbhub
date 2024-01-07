import { FrequencyListEntry } from '@qbhub/types';
import { Err, Result, log, makeErr, makeOk, matchResult } from '@qbhub/utils';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import * as fetchUtils from '../utils/fetch';
import { FetchFreqErr } from '../utils/fetch';
import { Settings } from '../utils/settings/types';

type FrequencyListState = {
  hasMoreEntries: boolean;
  isFetching: boolean;
  offset: number;
  results: FrequencyListEntry[] | undefined;
};

const initialState: FrequencyListState = {
  hasMoreEntries: true,
  isFetching: false,
  offset: 0,
  results: undefined,
};

const PAGE_SIZE = 20;
const FETCH_LIMIT = 5 * PAGE_SIZE;

type NoMoreEntriesErr = Err<{ errType: 'NoMoreEntriesErr' }>;
type UndefinedResultsErr = Err<{ errType: 'UndefinedResultsErr' }>;

type FetchPagesArgs = { offset: number; settings: Settings };
export const fetchPages = createAppAsyncThunk<
  Result<{ newEntries: FrequencyListEntry[] }, FetchFreqErr | NoMoreEntriesErr>,
  FetchPagesArgs
>('frequencyList/fetchPages', async ({ offset, settings }, { getState }) => {
  const fetchParams = { ...settings, limit: FETCH_LIMIT, offset };
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
});

type NextPageArgs = Omit<FetchPagesArgs, 'offset'>;
type NextPageResult = Result<
  { nextOffset: number },
  FetchFreqErr | NoMoreEntriesErr | UndefinedResultsErr
>;
export const nextPage = createAppAsyncThunk<NextPageResult, NextPageArgs>(
  'frequencyList/nextPage',
  async (args, { dispatch, getState }) => {
    const {
      frequencyList: { isFetching, offset, results },
    } = getState();

    if (results === undefined) {
      return makeErr({
        errType: 'UndefinedResultsErr' as const,
      });
    }

    const nextOffset = offset + PAGE_SIZE;
    // if on the last page, wait for fetch
    if (nextOffset >= results.length) {
      const fetchPagesResult = await dispatch(
        fetchPages({ ...args, offset: results.length }),
      ).unwrap();
      return matchResult(fetchPagesResult, () => makeOk({ nextOffset }));
    }

    // if 3 pages from the last page, fetch more in the background
    if (offset + 3 * PAGE_SIZE >= results.length && !isFetching) {
      log.info('Less than 3 pages left, prefetching frequency list pages');
      dispatch(fetchPages({ ...args, offset: results.length }));
    }

    return makeOk({ nextOffset });
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
    builder.addCase(nextPage.fulfilled, (state, { payload }) => {
      matchResult(payload, ({ nextOffset }) => {
        log.info(`Setting nextOffset to ${nextOffset}`);
        state.offset = nextOffset;
      });
    });
  },
  initialState,
  name: 'frequencyList',
  reducers: {
    prevPage: (state) => {
      state.offset = Math.max(0, state.offset - PAGE_SIZE);
    },
    reset() {
      return initialState;
    },
  },
});
export const selectFrequencyList = ({ frequencyList }: RootState) => {
  const { hasMoreEntries, offset, results } = frequencyList;
  const currentPage = results?.slice(offset, offset + PAGE_SIZE);

  const maximumOffset =
    hasMoreEntries || results === undefined
      ? undefined
      : results.length - PAGE_SIZE;

  return { ...frequencyList, currentPage, maximumOffset };
};
export const { prevPage, reset } = frequencyListSlice.actions;

export default frequencyListSlice.reducer;
