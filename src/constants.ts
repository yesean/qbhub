import { Category, Difficulty, Subcategory } from './types/questions';

export const CATEGORIES = [
  { label: 'Current Events', value: Category['Current Events'] },
  { label: 'Fine Arts', value: Category['Fine Arts'] },
  { label: 'Geography', value: Category.Geography },
  { label: 'History', value: Category.History },
  { label: 'Literature', value: Category.Literature },
  { label: 'Mythology', value: Category.Mythology },
  { label: 'Philosophy', value: Category.Philosophy },
  { label: 'Religion', value: Category.Religion },
  { label: 'Science', value: Category.Science },
  { label: 'Social Science', value: Category['Social Science'] },
  { label: 'Trash', value: Category.Trash },
];

export const SUBCATEGORIES = [
  { label: 'Current Events American', value: 40, category: 26 },
  { label: 'Current Events Other', value: 42, category: 26 },
  { label: 'Fine Arts American', value: 35, category: 21 },
  { label: 'Fine Arts Audiovisual', value: 27, category: 21 },
  { label: 'Fine Arts Auditory', value: 8, category: 21 },
  { label: 'Fine Arts British', value: 45, category: 21 },
  { label: 'Fine Arts European', value: 50, category: 21 },
  { label: 'Fine Arts Opera', value: 77, category: 21 },
  { label: 'Fine Arts Other', value: 25, category: 21 },
  { label: 'Fine Arts Visual', value: 2, category: 21 },
  { label: 'Fine Arts World', value: 43, category: 21 },
  { label: 'Geography American', value: 38, category: 20 },
  { label: 'Geography World', value: 44, category: 20 },
  { label: 'History American', value: 13, category: 18 },
  { label: 'History British', value: 6, category: 18 },
  { label: 'History Classical', value: 16, category: 18 },
  { label: 'History European', value: 24, category: 18 },
  { label: 'History Other', value: 28, category: 18 },
  { label: 'History World', value: 20, category: 18 },
  { label: 'Literature American', value: 4, category: 15 },
  { label: 'Literature British', value: 22, category: 15 },
  { label: 'Literature Classical', value: 30, category: 15 },
  { label: 'Literature European', value: 1, category: 15 },
  { label: 'Literature Other', value: 29, category: 15 },
  { label: 'Literature World', value: 12, category: 15 },
  { label: 'Mythology American', value: 33, category: 14 },
  { label: 'Mythology Chinese', value: 47, category: 14 },
  { label: 'Mythology Egyptian', value: 65, category: 14 },
  { label: 'Mythology Greco-Roman', value: 58, category: 14 },
  { label: 'Mythology Indian', value: 46, category: 14 },
  { label: 'Mythology Japanese', value: 48, category: 14 },
  { label: 'Mythology Norse', value: 63, category: 14 },
  { label: 'Mythology Other', value: 54, category: 14 },
  { label: 'Mythology Other East Asian', value: 49, category: 14 },
  { label: 'Philosophy American', value: 39, category: 25 },
  { label: 'Philosophy Classical', value: 61, category: 25 },
  { label: 'Philosophy East Asian', value: 52, category: 25 },
  { label: 'Philosophy European', value: 66, category: 25 },
  { label: 'Philosophy Other', value: 74, category: 25 },
  { label: 'Religion American', value: 31, category: 19 },
  { label: 'Religion Christianity', value: 57, category: 19 },
  { label: 'Religion East Asian', value: 51, category: 19 },
  { label: 'Religion Islam', value: 68, category: 19 },
  { label: 'Religion Judaism', value: 69, category: 19 },
  { label: 'Religion Other', value: 62, category: 19 },
  { label: 'Science American', value: 36, category: 17 },
  { label: 'Science Biology', value: 14, category: 17 },
  { label: 'Science Chemistry', value: 5, category: 17 },
  { label: 'Science Computer Science', value: 23, category: 17 },
  { label: 'Science Math', value: 26, category: 17 },
  { label: 'Science Other', value: 10, category: 17 },
  { label: 'Science Physics', value: 18, category: 17 },
  { label: 'Science World', value: 37, category: 17 },
  { label: 'Social Science American', value: 34, category: 22 },
  { label: 'Social Science Anthropology', value: 76, category: 22 },
  { label: 'Social Science Economics', value: 56, category: 22 },
  { label: 'Social Science Linguistics', value: 75, category: 22 },
  { label: 'Social Science Other', value: 60, category: 22 },
  {
    label: 'Social Science Political Science',
    value: 64,
    category: 22,
  },
  { label: 'Social Science Psychology', value: 71, category: 22 },
  { label: 'Social Science Sociology', value: 73, category: 22 },
  { label: 'Trash American', value: 32, category: 16 },
  { label: 'Trash Movies', value: 72, category: 16 },
  { label: 'Trash Music', value: 67, category: 16 },
  { label: 'Trash Other', value: 59, category: 16 },
  { label: 'Trash Sports', value: 55, category: 16 },
  { label: 'Trash Television', value: 70, category: 16 },
  { label: 'Trash Video Games', value: 53, category: 16 },
];

export const SUBCATEGORY_MAP = SUBCATEGORIES.reduce<{
  [key in Subcategory]: Category;
}>(
  (acc, sc) => ({ ...acc, [sc.value]: sc.category }),
  {} as { [key in Subcategory]: Category },
);

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

export const READING_SPEED_LS_KEY = 'reading_speed';
export const CATEGORIES_LS_KEY = 'categories';
export const SUBCATEGORIES_LS_KEY = 'subcategories';
export const DIFFICULTIES_LS_KEY = 'difficulties';

export const DEFAULT_READING_SPEED = 60;
