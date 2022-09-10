import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { AppDispatch, RootState, Subscription } from '../app/store';
import {
  filterBonusesByCategory,
  filterBonusesByDifficulties,
  filterBonusesByFromYear,
  filterBonusesBySubcategory,
} from '../BonusReader/bonusReaderSlice';
import {
  filterTossupsByCategory,
  filterTossupsByDifficulties,
  filterTossupsByFromYear,
  filterTossupsBySubcategory,
} from '../TossupReader/tossupReaderSlice';
import { Category, Difficulty, Subcategory } from '../types/questions';
import {
  restoreCategories,
  restoreDifficulties,
  restoreFromYear,
  restoreReadingSpeed,
  restoreSubcategories,
  saveCategories,
  saveDifficulties,
  saveFromYear,
  saveReadingSpeed,
  saveSubcategories,
} from '../utils/settings';

const initialState = {
  isOpen: false,
  readingSpeed: restoreReadingSpeed(),
  categories: restoreCategories(),
  subcategories: restoreSubcategories(),
  difficulties: restoreDifficulties(),
  fromYear: restoreFromYear(),
};

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
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateSubcategories: (state, action) => {
      state.subcategories = action.payload;
    },
    updateDifficulties: (state, action) => {
      state.difficulties = action.payload;
    },
    updateFromYear: (state, action) => {
      state.fromYear = action.payload;
    },
  },
});
export const {
  updateReadingSpeed,
  updateCategories,
  updateSubcategories,
  updateDifficulties,
  updateFromYear,
  open,
  close,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
const selectReadingSpeed = (state: RootState) => state.settings.readingSpeed;
const selectCategories = (state: RootState) => state.settings.categories;
const selectSubcategories = (state: RootState) => state.settings.subcategories;
const selectDifficulties = (state: RootState) => state.settings.difficulties;
const selectFromYear = (state: RootState) => state.settings.fromYear;
export const selectQuestionSettings = createSelector(
  [selectCategories, selectSubcategories, selectDifficulties, selectFromYear],
  (categories, subcategories, difficulties, fromYear) => ({
    categories,
    subcategories,
    difficulties,
    fromYear,
  }),
);

export const readingSpeedSubscription: Subscription<number> = [
  selectReadingSpeed,
  (readingSpeed: number) => saveReadingSpeed(readingSpeed),
];
export const categoriesSubscription: Subscription<Category[]> = [
  selectCategories,
  (categories: Category[], dispatch: AppDispatch) => {
    saveCategories(categories);
    dispatch(filterTossupsByCategory(categories));
    dispatch(filterBonusesByCategory(categories));
  },
];
export const subcategoriesSubscription: Subscription<Subcategory[]> = [
  selectSubcategories,
  (subcategories: Subcategory[], dispatch: AppDispatch) => {
    saveSubcategories(subcategories);
    dispatch(filterTossupsBySubcategory(subcategories));
    dispatch(filterBonusesBySubcategory(subcategories));
  },
];
export const difficultiesSubscription: Subscription<Difficulty[]> = [
  selectDifficulties,
  (difficulties: Difficulty[], dispatch: AppDispatch) => {
    saveDifficulties(difficulties);
    dispatch(filterTossupsByDifficulties(difficulties));
    dispatch(filterBonusesByDifficulties(difficulties));
  },
];
export const fromYearSubscription: Subscription<number> = [
  selectFromYear,
  (fromYear: number, dispatch: AppDispatch) => {
    saveFromYear(fromYear);
    dispatch(filterTossupsByFromYear(fromYear));
    dispatch(filterBonusesByFromYear(fromYear));
  },
];

export default settingsSlice.reducer;
