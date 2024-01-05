import { Tossup, TossupResult, TossupScore } from '@qbhub/types';
import { isEmpty } from '@qbhub/utils';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type TossupReaderState = {
  currentTossup: Tossup | undefined;
  isFetching: boolean;
  isUserWaiting: boolean;
  results: TossupResult[];
  tossups: Tossup[] | undefined;
};

const initialState: TossupReaderState = {
  currentTossup: undefined,
  isFetching: false,
  isUserWaiting: false,
  results: [],
  tossups: undefined,
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
  tossups: Tossup[],
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
      tossupReader: { tossups },
    } = getState();

    await fetchTossupsIfNeeded(tossups ?? [], dispatch, args);
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
    tossupReader: { tossups },
  } = getState();
  if (tossups === undefined) {
    return;
  }
  fetchTossupsIfNeeded(tossups, dispatch, args);
});

const tossupReaderSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchTossups.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchTossups.fulfilled, (state, action) => {
        state.isFetching = false;
        state.tossups = [...(state.tossups ?? []), ...action.payload];
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
        state.currentTossup = state.tossups?.shift();
      })
      .addCase(nextTossup.rejected, (state) => {
        state.isUserWaiting = false;
      });
    builder.addCase(filterTossups, (state, { payload: { settings } }) => {
      state.tossups = state.tossups?.filter((tu) =>
        isQuestionValid(tu, settings),
      );
    });
  },
  initialState,
  name: 'tossupReader',
  reducers: {
    submitResult: (state, action: PayloadAction<TossupResult>) => {
      state.results.unshift(action.payload);
    },
  },
});
export const { submitResult } = tossupReaderSlice.actions;

type TossupResultsSummary = {
  score: number;
  scoreCounts: Record<TossupScore, number>;
};
const INITIAL_TOSSUP_RESULTS_SUMMARY = {
  score: 0,
  scoreCounts: {
    [TossupScore.power]: 0,
    [TossupScore.ten]: 0,
    [TossupScore.incorrect]: 0,
    [TossupScore.neg]: 0,
  },
};

export const selectTossupReader = ({ tossupReader }: RootState) => {
  const score = tossupReader.results.reduce(
    (acc, result) => acc + result.score,
    0,
  );
  const isUninitialized =
    tossupReader.tossups === undefined && !tossupReader.isFetching;

  const tossupResultsSummary: TossupResultsSummary =
    tossupReader.results.reduce(
      ({ score, scoreCounts }, result) => ({
        score: score + result.score,
        scoreCounts: {
          ...scoreCounts,
          [result.score]: scoreCounts[result.score] + 1,
        },
      }),
      INITIAL_TOSSUP_RESULTS_SUMMARY,
    );

  return { ...tossupReader, isUninitialized, score, tossupResultsSummary };
};

export default tossupReaderSlice.reducer;
