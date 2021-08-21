import { Category, Difficulty, Tossup } from './types';

export const CATEGORIES = [
  { label: 'Science', value: Category.Science },
  { label: 'Literature', value: Category.Literature },
  { label: 'History', value: Category.History },
  { label: 'Fine Arts', value: Category['Fine Arts'] },
  { label: 'Philosophy', value: Category.Philosophy },
  { label: 'Social Science', value: Category['Social Science'] },
  { label: 'Geography', value: Category.Geography },
  { label: 'Mythology', value: Category.Mythology },
  { label: 'Religion', value: Category.Religion },
  { label: 'Current Events', value: Category['Current Events'] },
  { label: 'Trash', value: Category.Trash },
];

export const DIFFICULTIES = [
  { label: 'Middle School', value: Difficulty['Middle School'] },
  { label: 'Easy High School', value: Difficulty['Easy High School'] },
  { label: 'Regular High School', value: Difficulty['Regular High School'] },
  { label: 'Hard High School', value: Difficulty['Hard High School'] },
  {
    label: 'National High School',
    value: Difficulty['National High School'],
  },
  { label: 'Easy College', value: Difficulty['Easy College'] },
  { label: 'Regular College', value: Difficulty['Regular College'] },
  { label: 'Hard College', value: Difficulty['Hard College'] },
  { label: 'Open', value: Difficulty.Open },
];

export const blankTossup: Tossup = {
  text: '',
  answer: '',
  category: Category.Science,
  difficulty: Difficulty['Easy College'],
  tournament: '',
};

export const defaultCategories = [Category.Science, Category.Literature];
export const defaultDifficulties = [
  Difficulty['Easy College'],
  Difficulty['Regular College'],
];
