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
      if (
        state.status === ReaderStatus.idle ||
        state.status === ReaderStatus.answered
      ) {
        state.status = ReaderStatus.reading;
        state.currentTossup += 1;
      }
    },
    buzz: (state) => {
      if (state.status === ReaderStatus.reading) {
        state.status = ReaderStatus.answering;
      }
    },
    submitAnswer: (state, action) => {
      if (state.status === ReaderStatus.answering) {
        state.status = ReaderStatus.answered;
      }
    },
  },
});

export default tossupReaderSlice.reducer;
