import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

enum ReaderStatus {
  idle,
  reading,
  answering,
  answered,
  loading,
}

const initialState = {
  status: ReaderStatus.idle,
  tossups: [],
  currentTossup: 0,
  seenTossups: [],
};

export const fetchTossups = createAsyncThunk(
  'tossupReader/fetchTossups',
  async () => {},
);

const tossupReaderSlice = createSlice({
  name: 'tossupReader',
  initialState,
  reducers: {
    startNextTossup: (state) => {
      state.currentTossup += 1;
    },
    buzz: (state) => {
      if (state.status === ReaderStatus.reading) {
        state.status = ReaderStatus.answering;
      }
    },
    submitAnswer: (state, action) => {},
  },
});

export default tossupReaderSlice.reducer;
