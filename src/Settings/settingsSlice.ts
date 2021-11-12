import { createSlice } from '@reduxjs/toolkit';
import {
  getInitialCategories,
  getInitialDifficulties,
  getInitialReadingSpeed,
  getInitialSubcategories,
} from '../services/utils';

const initialState = {
  readingSpeed: getInitialReadingSpeed(),
  categories: getInitialCategories(),
  subcategories: getInitialSubcategories(),
  difficulties: getInitialDifficulties(),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateReadingSpeed: (state, action) => {
      state.readingSpeed = action.payload;
    },
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateSubcategories: (state, action) => {
      state.subcategories = action.payload;
    },
    updateDifficulties: (state, action) => {
      state.difficulties = action.payload;
    },
  },
});

export default settingsSlice.reducer;
