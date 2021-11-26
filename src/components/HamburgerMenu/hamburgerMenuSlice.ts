import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

const initialState = {
  isOpen: false,
};

const hamburgerMenuSlice = createSlice({
  name: 'hamburgerMenu',
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
export const { open, close } = hamburgerMenuSlice.actions;

export const selectHamburgerMenu = (state: RootState) => state.hamburgerMenu;

export default hamburgerMenuSlice.reducer;
