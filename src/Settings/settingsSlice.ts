import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import type { RootState, Subscription } from '../app/store';
import {
  filterBonusesByCategory,
  filterBonusesByDifficulties,
  filterBonusesBySubcategory,
} from '../BonusReader/bonusReaderSlice';
import {
  filterTossupsByCategory,
  filterTossupsByDifficulties,
  filterTossupsBySubcategory,
} from '../TossupReader/tossupReaderSlice';
import { Category, Difficulty, Subcategory } from '../types/questions';
import {
  restoreCategories,
  restoreDifficulties,
  restoreReadingSpeed,
  restoreSubcategories,
  saveCategories,
  saveDifficulties,
  saveReadingSpeed,
  saveSubcategories,
} from '../utils/settings';

const initialState = {
  isOpen: false,
  readingSpeed: restoreReadingSpeed(),
  categories: restoreCategories(),
  subcategories: restoreSubcategories(),
  difficulties: restoreDifficulties(),
};

export const updateCategories = createAsyncThunk<Category[], Category[]>(
  'settings/updateCategories',
  (categories, { dispatch }) => {
    dispatch(filterTossupsByCategory(categories));
    dispatch(filterBonusesByCategory(categories));
    return categories;
  },
);

export const updateSubcategories = createAsyncThunk<
  Subcategory[],
  Subcategory[]
>('settings/updateSubcategories', (subcategories, { dispatch }) => {
  dispatch(filterTossupsBySubcategory(subcategories));
  dispatch(filterBonusesBySubcategory(subcategories));
  return subcategories;
});

export const updateDifficulties = createAsyncThunk<Difficulty[], Difficulty[]>(
  'settings/updateDifficulties',
  (difficulties, { dispatch }) => {
    dispatch(filterTossupsByDifficulties(difficulties));
    dispatch(filterBonusesByDifficulties(difficulties));
    return difficulties;
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
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
export const { updateReadingSpeed, open, close } = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
const selectReadingSpeed = (state: RootState) => state.settings.readingSpeed;
const selectCategories = (state: RootState) => state.settings.categories;
const selectSubcategories = (state: RootState) => state.settings.subcategories;
const selectDifficulties = (state: RootState) => state.settings.difficulties;
export const selectQuestionSettings = createSelector(
  [selectCategories, selectSubcategories, selectDifficulties],
  (categories, subcategories, difficulties) => ({
    categories,
    subcategories,
    difficulties,
  }),
);

export const readingSpeedSubscription: Subscription<number> = [
  selectReadingSpeed,
  (readingSpeed: number) => saveReadingSpeed(readingSpeed),
];
export const categoriesSubscription: Subscription<Category[]> = [
  selectCategories,
  (categories: Category[]) => saveCategories(categories),
];
export const subcategoriesSubscription: Subscription<Subcategory[]> = [
  selectSubcategories,
  (subcategories: Subcategory[]) => saveSubcategories(subcategories),
];
export const difficultiesSubscription: Subscription<Difficulty[]> = [
  selectDifficulties,
  (difficulties: Difficulty[]) => saveDifficulties(difficulties),
];

export default settingsSlice.reducer;
