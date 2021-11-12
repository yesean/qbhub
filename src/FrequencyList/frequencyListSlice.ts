import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  answers: [],
  currentAnswers: 0,
};

const frequencyListSlice = createSlice({
  name: 'frequencyList',
  initialState,
  reducers: {},
});

export default frequencyListSlice.reducer;
