import { Tossup, TossupResult } from '@qbhub/types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import * as fetchUtils from '../utils/fetch';
import { Settings } from '../utils/settings/types';
import { isQuestionValid } from '../utils/settings/validate';

type TossupReaderState = {
  isFetching: boolean;
  results: TossupResult[];
  tossups: Tossup[];
};

const initialState: TossupReaderState = {
  isFetching: false,
  results: [],
  tossups: [],
};

const fetchTossups = createAsyncThunk<Tossup[], { settings: Settings }>(
  'tossupReader/fetchTossups',
  async ({ settings }) => {
    const tossups = await fetchUtils.fetchTossups(settings);
    return tossups;
  },
);

export const nextTossup = createAsyncThunk<
  void,
  { settings: Settings },
  { state: RootState }
>('tossupReader/nextTossup', async (args, { dispatch, getState }) => {
  const { tossupReader } = getState();
  // if tossup cache is low, fetch more
  // if tossup cache is empty, keep the action pending
  if (tossupReader.tossups.length === 0) {
    await dispatch(fetchTossups(args)).unwrap();
  } else if (tossupReader.tossups.length < 5) {
    dispatch(fetchTossups(args));
  }
});

const tossupReaderSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchTossups.fulfilled, (state, action) => {
      state.tossups.push(...action.payload);
    });
    builder
      .addCase(nextTossup.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(nextTossup.fulfilled, (state) => {
        state.isFetching = false;
        state.tossups.shift();
      })
      .addCase(nextTossup.rejected, (state) => {
        state.isFetching = false;
      });
  },
  initialState,
  name: 'tossupReader',
  reducers: {
    filterTossups: (state, { payload: settings }: PayloadAction<Settings>) => {
      state.tossups = state.tossups.filter((tu) =>
        isQuestionValid(tu, settings),
      );
    },
    submitResult: (state, action: PayloadAction<TossupResult>) => {
      state.results.push(action.payload);
    },
  },
});
export const { filterTossups, submitResult } = tossupReaderSlice.actions;

export const selectTossupReader = ({ tossupReader }: RootState) => {
  const score = tossupReader.results.reduce(
    (acc, result) => acc + result.score,
    0,
  );

  const currentTossup = tossupReader.tossups.at(0);

  return { ...tossupReader, currentTossup, score };
};

export default tossupReaderSlice.reducer;
