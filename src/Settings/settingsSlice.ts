import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import {
  filterTossupsByCategory,
  filterTossupsByDifficulties,
  filterTossupsBySubcategory,
} from '../TossupReader/tossupReaderSlice';
import { Category, Difficulty, Subcategory } from '../types/questions';
import {
  getInitialCategories,
  getInitialDifficulties,
  getInitialReadingSpeed,
  getInitialSubcategories,
} from '../utils/settings';

const initialState = {
  readingSpeed: getInitialReadingSpeed(),
  categories: getInitialCategories(),
  subcategories: getInitialSubcategories(),
  difficulties: getInitialDifficulties(),
};

export const updateCategories = createAsyncThunk<Category[], Category[]>(
  'settings/updateCategories',
  (categories, { dispatch }) => {
    dispatch(filterTossupsByCategory(categories));
    return categories;
  },
);

export const updateSubcategories = createAsyncThunk<
  Subcategory[],
  Subcategory[]
>('settings/updateSubcategories', (subcategories, { dispatch }) => {
  dispatch(filterTossupsBySubcategory(subcategories));
  return subcategories;
});

export const updateDifficulties = createAsyncThunk<Difficulty[], Difficulty[]>(
  'settings/updateDifficulties',
  (difficulties, { dispatch }) => {
    dispatch(filterTossupsByDifficulties(difficulties));
    return difficulties;
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateReadingSpeed: (state, action) => {
      state.readingSpeed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(updateSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
      })
      .addCase(updateDifficulties.fulfilled, (state, action) => {
        state.difficulties = action.payload;
      });
  },
});
export const { updateReadingSpeed } = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
