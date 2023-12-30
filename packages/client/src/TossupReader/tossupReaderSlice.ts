import { Tossup, TossupResult } from '@qbhub/types';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../redux/store';
import { createAppAsyncThunk } from '../redux/utils';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type TossupReaderState = {
  isFetching: boolean;
  results: TossupResult[];
  tossups: Tossup[] | undefined;
};

const initialState: TossupReaderState = {
  isFetching: false,
  results: [],
  tossups: undefined,
};

type FetchTossupsArgs = { settings: Settings };
const fetchTossups = createAppAsyncThunk<Tossup[], FetchTossupsArgs>(
  'tossupReader/fetchTossups',
  async ({ settings }) => {
    const tossups = await fetchUtils.fetchTossups(settings);
    return tossups;
  },
);

async function fetchTossupsIfNeeded(
  tossups: Tossup[],
  dispatch: AppDispatch,
  args: FetchTossupsArgs,
) {
  // if tossup cache is low, fetch more
  // if tossup cache is empty, keep the action pending
  if (tossups.length === 0) {
    await dispatch(fetchTossups(args)).unwrap();
  } else if (tossups.length < 5) {
    dispatch(fetchTossups(args));
  }
}

export const nextTossup = createAppAsyncThunk<void, FetchTossupsArgs>(
  'tossupReader/nextTossup',
  async (args, { dispatch, getState }) => {
    const {
      tossupReader: { tossups },
    } = getState();

    if (tossups === undefined) {
      await dispatch(fetchTossups(args)).unwrap();
      return;
    }
    fetchTossupsIfNeeded(tossups, dispatch, args);
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
    builder.addCase(fetchTossups.fulfilled, (state, action) => {
      state.tossups = [...(state.tossups ?? []), ...action.payload];
    });
    builder
      .addCase(nextTossup.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(nextTossup.fulfilled, (state) => {
        state.isFetching = false;
        state.tossups?.shift();
      })
      .addCase(nextTossup.rejected, (state) => {
        state.isFetching = false;
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
      state.results.push(action.payload);
    },
  },
});
export const { submitResult } = tossupReaderSlice.actions;

export const selectTossupReader = ({ tossupReader }: RootState) => {
  const score = tossupReader.results.reduce(
    (acc, result) => acc + result.score,
    0,
  );

  const currentTossup = tossupReader.tossups?.at(0);

  return { ...tossupReader, currentTossup, score };
};

export default tossupReaderSlice.reducer;
