import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';

const initialState = {
  isOpen: false,
};

const tossupHistoryModalSlice = createSlice({
  name: 'tossupHistoryModal',
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
export const { open, close } = tossupHistoryModalSlice.actions;

export const selectTossupHistoryModal = (state: RootState) =>
  state.tossupHistoryModal;

export default tossupHistoryModalSlice.reducer;
