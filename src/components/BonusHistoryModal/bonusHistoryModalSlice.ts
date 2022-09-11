import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../redux/store';

const initialState = {
  isOpen: false,
};

const bonusHistoryModalSlice = createSlice({
  name: 'bonusHistoryModal',
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
export const { open, close } = bonusHistoryModalSlice.actions;

export const selectBonusHistoryModal = (state: RootState) =>
  state.bonusHistoryModal;

export default bonusHistoryModalSlice.reducer;
