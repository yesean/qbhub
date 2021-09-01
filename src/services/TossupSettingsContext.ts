import { createContext } from 'react';
import { DEFAULT_READING_SPEED } from '../constants';
import { Category, Difficulty, Subcategory } from '../types';

export type TossupSettingsContextType = {
  readingSpeed: number; // ms / word
  setReadingSpeed: React.Dispatch<React.SetStateAction<number>>;
  categoriesSelected: Category[];
  setCategoriesSelected: React.Dispatch<React.SetStateAction<Category[]>>;
  subcategoriesSelected: Subcategory[];
  setSubcategoriesSelected: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  difficultiesSelected: Difficulty[];
  setDifficultiesSelected: React.Dispatch<React.SetStateAction<Difficulty[]>>;
};

export const TossupSettingsContext = createContext<TossupSettingsContextType>({
  readingSpeed: DEFAULT_READING_SPEED,
  setReadingSpeed: () => {},
  categoriesSelected: [],
  setCategoriesSelected: () => {},
  subcategoriesSelected: [],
  setSubcategoriesSelected: () => {},
  difficultiesSelected: [],
  setDifficultiesSelected: () => {},
});
