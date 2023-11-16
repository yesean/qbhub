import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';

const initialState = {
  isOpen: false,
};

const infoModalSlice = createSlice({
  name: 'infoModal',
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});
export const { open, close } = infoModalSlice.actions;

export const selectInfoModal = (state: RootState) => state.infoModal;

export default infoModalSlice.reducer;
