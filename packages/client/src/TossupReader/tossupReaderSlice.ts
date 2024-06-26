import { Tossup, TossupInstance, TossupResult } from '@qbhub/types';
import { isEmpty } from '@qbhub/utils';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import type { AppDispatch, RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';
import {
  getTossupResultsSummary,
  INITIAL_TOSSUP_RESULTS_SUMMARY,
  TossupResultsSummary,
} from '../utils/tossup';

type TossupReaderState = TossupResultsSummary & {
  currentTossupInstance: TossupInstance | undefined;
  isFetching: boolean;
  isUserWaiting: boolean;
  results: TossupResult[];
  tossupInstances: TossupInstance[] | undefined;
};

const initialState: TossupReaderState = {
  currentTossupInstance: undefined,
  isFetching: false,
  isUserWaiting: false,
  results: [],
  tossupInstances: undefined,
  ...INITIAL_TOSSUP_RESULTS_SUMMARY,
};

type FetchTossupsArgs = { settings: Settings };
const fetchTossups = createAppAsyncThunk<Tossup[], FetchTossupsArgs>(
  'tossupReader/fetchTossups',
  async ({ settings: { fromYear: from, ...otherSettings } }) => {
    const tossups = await fetchUtils.fetchTossups({ ...otherSettings, from });
    return tossups;
  },
);

async function fetchTossupsIfNeeded(
  tossups: TossupInstance[],
  dispatch: AppDispatch,
  args: FetchTossupsArgs,
) {
  if (tossups.length > 5) {
    return;
  }

  const promise = dispatch(fetchTossups(args));
  if (isEmpty(tossups)) {
    await promise;
  }
}

export const nextTossup = createAppAsyncThunk<void, FetchTossupsArgs>(
  'tossupReader/nextTossup',
  async (args, { dispatch, getState }) => {
    const {
      tossupReader: { tossupInstances },
    } = getState();

    await fetchTossupsIfNeeded(tossupInstances ?? [], dispatch, args);
  },
);

type FilterTossupsArgs = { settings: Settings };
const filterTossups = createAction<FilterTossupsArgs>(
  'tossupReader/filterTossups',
);

export const filterTossupsWithRefetch = createAppAsyncThunk<
  void,
  FetchTossupsArgs & FilterTossupsArgs
>('tossupReader/filterTossupsWithRefetch', (args, { dispatch, getState }) => {
  dispatch(filterTossups(args));

  const {
    tossupReader: { tossupInstances },
  } = getState();
  if (tossupInstances === undefined) {
    return;
  }
  fetchTossupsIfNeeded(tossupInstances, dispatch, args);
});

const tossupReaderSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchTossups.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchTossups.fulfilled, (state, action) => {
        state.isFetching = false;
        const newTossupInstances: TossupInstance[] = action.payload.map(
          (tossup) => ({
            ...tossup,
            instanceID: v4(),
          }),
        );
        state.tossupInstances = [
          ...(state.tossupInstances ?? []),
          ...newTossupInstances,
        ];
      })
      .addCase(fetchTossups.rejected, (state) => {
        state.isFetching = false;
      });
    builder
      .addCase(nextTossup.pending, (state) => {
        state.isUserWaiting = true;
      })
      .addCase(nextTossup.fulfilled, (state) => {
        state.isUserWaiting = false;
        state.currentTossupInstance = state.tossupInstances?.shift();
      })
      .addCase(nextTossup.rejected, (state) => {
        state.isUserWaiting = false;
      });
    builder.addCase(filterTossups, (state, { payload: { settings } }) => {
      state.tossupInstances = state.tossupInstances?.filter((tossupInstance) =>
        isQuestionValid(tossupInstance, settings),
      );
    });
  },
  initialState,
  name: 'tossupReader',
  reducers: {
    submitResult: (state, action: PayloadAction<TossupResult>) => {
      state.results.unshift(action.payload);
    },
    updateResult(state, { payload }: PayloadAction<TossupResult>) {
      const index = state.results.findIndex(
        ({ instanceID }) => instanceID === payload.instanceID,
      );
      if (index === -1) {
        return;
      }

      state.results[index] = payload;
    },
  },
});
export const { submitResult, updateResult } = tossupReaderSlice.actions;

export const selectTossupReader = ({ tossupReader }: RootState) => {
  const isUninitialized =
    tossupReader.tossupInstances === undefined && !tossupReader.isFetching;

  const latestTossupResult = tossupReader.results.at(0);
  const tossupResultsSummary = getTossupResultsSummary(tossupReader.results);

  return {
    ...tossupReader,
    ...tossupResultsSummary,
    isUninitialized,
    latestTossupResult,
  };
};

export default tossupReaderSlice.reducer;
