import { Category, Difficulty, Subcategory, Tossup } from './types';

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

export const SUBCATEGORIES = [
  { label: 'Literature European', value: Subcategory['Literature European'] },
  { label: 'Fine Arts Visual', value: Subcategory['Fine Arts Visual'] },
  { label: 'Literature American', value: Subcategory['Literature American'] },
  { label: 'Science Chemistry', value: Subcategory['Science Chemistry'] },
  { label: 'History British', value: Subcategory['History British'] },
  { label: 'Fine Arts Auditory', value: Subcategory['Fine Arts Auditory'] },
  { label: 'Science Other', value: Subcategory['Science Other'] },
  { label: 'History American', value: Subcategory['History American'] },
  { label: 'Science Biology', value: Subcategory['Science Biology'] },
  { label: 'History Classical', value: Subcategory['History Classical'] },
  { label: 'Science Physics', value: Subcategory['Science Physics'] },
  { label: 'History World', value: Subcategory['History World'] },
  { label: 'Literature British', value: Subcategory['Literature British'] },
  {
    label: 'Science Computer Science',
    value: Subcategory['Science Computer Science'],
  },
  { label: 'History European', value: Subcategory['History European'] },
  { label: 'Fine Arts Other', value: Subcategory['Fine Arts Other'] },
  { label: 'Science Math', value: Subcategory['Science Math'] },
  {
    label: 'Fine Arts Audiovisual',
    value: Subcategory['Fine Arts Audiovisual'],
  },
  { label: 'History Other', value: Subcategory['History Other'] },
  { label: 'Literature Other', value: Subcategory['Literature Other'] },
  { label: 'Literature Classical', value: Subcategory['Literature Classical'] },
  { label: 'Religion American', value: Subcategory['Religion American'] },
  { label: 'Trash American', value: Subcategory['Trash American'] },
  { label: 'Mythology American', value: Subcategory['Mythology American'] },
  {
    label: 'Social Science American',
    value: Subcategory['Social Science American'],
  },
  { label: 'Fine Arts American', value: Subcategory['Fine Arts American'] },
  { label: 'Science American', value: Subcategory['Science American'] },
  { label: 'Science World', value: Subcategory['Science World'] },
  { label: 'Geography American', value: Subcategory['Geography American'] },
  { label: 'Philosophy American', value: Subcategory['Philosophy American'] },
  {
    label: 'Current Events American',
    value: Subcategory['Current Events American'],
  },
  { label: 'Current Events Other', value: Subcategory['Current Events Other'] },
  { label: 'Fine Arts World', value: Subcategory['Fine Arts World'] },
  { label: 'Geography World', value: Subcategory['Geography World'] },
  { label: 'Fine Arts British', value: Subcategory['Fine Arts British'] },
  { label: 'Mythology Indian', value: Subcategory['Mythology Indian'] },
  { label: 'Mythology Chinese', value: Subcategory['Mythology Chinese'] },
  {
    label: 'Mythology Other East Asian',
    value: Subcategory['Mythology Other East Asian'],
  },
  { label: 'Mythology Japanese', value: Subcategory['Mythology Japanese'] },
  { label: 'Fine Arts European', value: Subcategory['Fine Arts European'] },
  { label: 'Religion East Asian', value: Subcategory['Religion East Asian'] },
  {
    label: 'Philosophy East Asian',
    value: Subcategory['Philosophy East Asian'],
  },
  { label: 'Trash Video Games', value: Subcategory['Trash Video Games'] },
  { label: 'Mythology Other', value: Subcategory['Mythology Other'] },
  { label: 'Trash Sports', value: Subcategory['Trash Sports'] },
  {
    label: 'Social Science Economics',
    value: Subcategory['Social Science Economics'],
  },
  {
    label: 'Religion Christianity',
    value: Subcategory['Religion Christianity'],
  },
  {
    label: 'Mythology Greco-Roman',
    value: Subcategory['Mythology Greco-Roman'],
  },
  { label: 'Trash Other', value: Subcategory['Trash Other'] },
  { label: 'Social Science Other', value: Subcategory['Social Science Other'] },
  { label: 'Philosophy Classical', value: Subcategory['Philosophy Classical'] },
  { label: 'Literature World', value: Subcategory['Literature World'] },
  { label: 'Religion Other', value: Subcategory['Religion Other'] },
  { label: 'Mythology Norse', value: Subcategory['Mythology Norse'] },
  {
    label: 'Social Science Political Science',
    value: Subcategory['Social Science Political Science'],
  },
  { label: 'Mythology Egyptian', value: Subcategory['Mythology Egyptian'] },
  { label: 'Philosophy European', value: Subcategory['Philosophy European'] },
  { label: 'Trash Music', value: Subcategory['Trash Music'] },
  { label: 'Religion Islam', value: Subcategory['Religion Islam'] },
  { label: 'Religion Judaism', value: Subcategory['Religion Judaism'] },
  { label: 'Trash Television', value: Subcategory['Trash Television'] },
  {
    label: 'Social Science Psychology',
    value: Subcategory['Social Science Psychology'],
  },
  { label: 'Trash Movies', value: Subcategory['Trash Movies'] },
  {
    label: 'Social Science Sociology',
    value: Subcategory['Social Science Sociology'],
  },
  { label: 'Philosophy Other', value: Subcategory['Philosophy Other'] },
  {
    label: 'Social Science Linguistics',
    value: Subcategory['Social Science Linguistics'],
  },
  {
    label: 'Social Science Anthropology',
    value: Subcategory['Social Science Anthropology'],
  },
  { label: 'Fine Arts Opera', value: Subcategory['Fine Arts Opera'] },
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
  formattedText: '',
  answer: '',
  formattedAnswer: '',
  category: Category.Science,
  subcategory: Subcategory['Science Computer Science'],
  difficulty: Difficulty['Easy College'],
  tournament: '',
};

const CATEGORIES_LS_KEY = 'categories';
const SUBCATEGORIES_LS_KEY = 'subcategories';
const DIFFICULTIES_LS_KEY = 'difficulties';

export const setInitialCategories = (categories: Category[]) => {
  window.localStorage.setItem(CATEGORIES_LS_KEY, JSON.stringify(categories));
};

export const getInitialCategories = () => {
  const defaultCategories = [Category.Science, Category.Literature];
  const categories = window.localStorage.getItem(CATEGORIES_LS_KEY);
  if (categories === null) {
    setInitialCategories(defaultCategories);
    return defaultCategories;
  }
  return JSON.parse(categories);
};

export const setInitialSubcategories = (subcategories: Subcategory[]) => {
  window.localStorage.setItem(
    SUBCATEGORIES_LS_KEY,
    JSON.stringify(subcategories)
  );
};

export const getInitialSubcategories = () => {
  const defaultSubcategories = [Subcategory['Science Computer Science']];
  const subcategories = window.localStorage.getItem(SUBCATEGORIES_LS_KEY);
  if (subcategories === null) {
    setInitialSubcategories(defaultSubcategories);
    return defaultSubcategories;
  }
  return JSON.parse(subcategories);
};

export const setInitialDifficulties = (difficulties: Difficulty[]) => {
  window.localStorage.setItem(
    DIFFICULTIES_LS_KEY,
    JSON.stringify(difficulties)
  );
};
export const getInitialDifficulties = () => {
  const defaultDifficulties = [
    Difficulty['Easy College'],
    Difficulty['Regular College'],
  ];
  const difficulties = window.localStorage.getItem(DIFFICULTIES_LS_KEY);
  if (difficulties === null) {
    setInitialDifficulties(defaultDifficulties);
    return defaultDifficulties;
  }
  return JSON.parse(difficulties);
};
