import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../redux/store';

const initialState = {
  isOpen: false,
};

const updatesModalSlice = createSlice({
  name: 'updatesModal',
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
export const { open, close } = updatesModalSlice.actions;

export const selectUpdatesModal = (state: RootState) => state.updatesModal;

export default updatesModalSlice.reducer;
