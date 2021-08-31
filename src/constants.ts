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
  {
    label: 'Literature European',
    value: Subcategory['Literature European'],
    category: Category.Literature,
  },
  {
    label: 'Fine Arts Visual',
    value: Subcategory['Fine Arts Visual'],
    category: Category['Fine Arts'],
  },
  {
    label: 'Literature American',
    value: Subcategory['Literature American'],
    category: Category.Literature,
  },
  {
    label: 'Science Chemistry',
    value: Subcategory['Science Chemistry'],
    category: Category.Science,
  },
  {
    label: 'History British',
    value: Subcategory['History British'],
    category: Category.History,
  },
  {
    label: 'Fine Arts Auditory',
    value: Subcategory['Fine Arts Auditory'],
    category: Category['Fine Arts'],
  },
  {
    label: 'Science Other',
    value: Subcategory['Science Other'],
    category: Category.Science,
  },
  {
    label: 'History American',
    value: Subcategory['History American'],
    category: Category.History,
  },
  {
    label: 'Science Biology',
    value: Subcategory['Science Biology'],
    category: Category.Science,
  },
  {
    label: 'History Classical',
    value: Subcategory['History Classical'],
    category: Category.History,
  },
  {
    label: 'Science Physics',
    value: Subcategory['Science Physics'],
    category: Category.Science,
  },
  {
    label: 'History World',
    value: Subcategory['History World'],
    category: Category.History,
  },
  {
    label: 'Literature British',
    value: Subcategory['Literature British'],
    category: Category.Literature,
  },
  {
    label: 'Science Computer Science',
    value: Subcategory['Science Computer Science'],
    category: Category.Science,
  },
  {
    label: 'History European',
    value: Subcategory['History European'],
    category: Category.History,
  },
  {
    label: 'Fine Arts Other',
    value: Subcategory['Fine Arts Other'],
    category: Category['Fine Arts'],
  },
  {
    label: 'Science Math',
    value: Subcategory['Science Math'],
    category: Category.Science,
  },
  {
    label: 'Fine Arts Audiovisual',
    value: Subcategory['Fine Arts Audiovisual'],
    category: Category['Fine Arts'],
  },
  {
    label: 'History Other',
    value: Subcategory['History Other'],
    category: Category.History,
  },
  {
    label: 'Literature Other',
    value: Subcategory['Literature Other'],
    category: Category.Literature,
  },
  {
    label: 'Literature Classical',
    value: Subcategory['Literature Classical'],
    category: Category.Literature,
  },
  {
    label: 'Religion American',
    value: Subcategory['Religion American'],
    category: Category.Religion,
  },
  {
    label: 'Trash American',
    value: Subcategory['Trash American'],
    category: Category.Trash,
  },
  {
    label: 'Mythology American',
    value: Subcategory['Mythology American'],
    category: Category.Mythology,
  },
  {
    label: 'Social Science American',
    value: Subcategory['Social Science American'],
    category: Category['Social Science'],
  },
  {
    label: 'Fine Arts American',
    value: Subcategory['Fine Arts American'],
    category: Category['Fine Arts'],
  },
  {
    label: 'Science American',
    value: Subcategory['Science American'],
    category: Category.Science,
  },
  {
    label: 'Science World',
    value: Subcategory['Science World'],
    category: Category.Science,
  },
  {
    label: 'Geography American',
    value: Subcategory['Geography American'],
    category: Category.Geography,
  },
  {
    label: 'Philosophy American',
    value: Subcategory['Philosophy American'],
    category: Category.Philosophy,
  },
  {
    label: 'Current Events American',
    value: Subcategory['Current Events American'],
    category: Category['Current Events'],
  },
  {
    label: 'Current Events Other',
    value: Subcategory['Current Events Other'],
    category: Category['Current Events'],
  },
  {
    label: 'Fine Arts World',
    value: Subcategory['Fine Arts World'],
    category: Category['Fine Arts'],
  },
  {
    label: 'Geography World',
    value: Subcategory['Geography World'],
    category: Category.Geography,
  },
  {
    label: 'Fine Arts British',
    value: Subcategory['Fine Arts British'],
    category: Category['Fine Arts'],
  },
  {
    label: 'Mythology Indian',
    value: Subcategory['Mythology Indian'],
    category: Category.Mythology,
  },
  {
    label: 'Mythology Chinese',
    value: Subcategory['Mythology Chinese'],
    category: Category.Mythology,
  },
  {
    label: 'Mythology Other East Asian',
    value: Subcategory['Mythology Other East Asian'],
    category: Category.Mythology,
  },
  {
    label: 'Mythology Japanese',
    value: Subcategory['Mythology Japanese'],
    category: Category.Mythology,
  },
  {
    label: 'Fine Arts European',
    value: Subcategory['Fine Arts European'],
    category: Category['Fine Arts'],
  },
  {
    label: 'Religion East Asian',
    value: Subcategory['Religion East Asian'],
    category: Category.Religion,
  },
  {
    label: 'Philosophy East Asian',
    value: Subcategory['Philosophy East Asian'],
    category: Category.Philosophy,
  },
  {
    label: 'Trash Video Games',
    value: Subcategory['Trash Video Games'],
    category: Category.Trash,
  },
  {
    label: 'Mythology Other',
    value: Subcategory['Mythology Other'],
    category: Category.Mythology,
  },
  {
    label: 'Trash Sports',
    value: Subcategory['Trash Sports'],
    category: Category.Trash,
  },
  {
    label: 'Social Science Economics',
    value: Subcategory['Social Science Economics'],
    category: Category['Social Science'],
  },
  {
    label: 'Religion Christianity',
    value: Subcategory['Religion Christianity'],
    category: Category.Religion,
  },
  {
    label: 'Mythology Greco-Roman',
    value: Subcategory['Mythology Greco-Roman'],
    category: Category.Mythology,
  },
  {
    label: 'Trash Other',
    value: Subcategory['Trash Other'],
    category: Category.Trash,
  },
  {
    label: 'Social Science Other',
    value: Subcategory['Social Science Other'],
    category: Category['Social Science'],
  },
  {
    label: 'Philosophy Classical',
    value: Subcategory['Philosophy Classical'],
    category: Category.Philosophy,
  },
  {
    label: 'Literature World',
    value: Subcategory['Literature World'],
    category: Category.Literature,
  },
  {
    label: 'Religion Other',
    value: Subcategory['Religion Other'],
    category: Category.Religion,
  },
  {
    label: 'Mythology Norse',
    value: Subcategory['Mythology Norse'],
    category: Category.Mythology,
  },
  {
    label: 'Social Science Political Science',
    value: Subcategory['Social Science Political Science'],
    category: Category['Social Science'],
  },
  {
    label: 'Mythology Egyptian',
    value: Subcategory['Mythology Egyptian'],
    category: Category.Mythology,
  },
  {
    label: 'Philosophy European',
    value: Subcategory['Philosophy European'],
    category: Category.Philosophy,
  },
  {
    label: 'Trash Music',
    value: Subcategory['Trash Music'],
    category: Category.Trash,
  },
  {
    label: 'Religion Islam',
    value: Subcategory['Religion Islam'],
    category: Category.Religion,
  },
  {
    label: 'Religion Judaism',
    value: Subcategory['Religion Judaism'],
    category: Category.Religion,
  },
  {
    label: 'Trash Television',
    value: Subcategory['Trash Television'],
    category: Category.Trash,
  },
  {
    label: 'Social Science Psychology',
    value: Subcategory['Social Science Psychology'],
    category: Category['Social Science'],
  },
  {
    label: 'Trash Movies',
    value: Subcategory['Trash Movies'],
    category: Category.Trash,
  },
  {
    label: 'Social Science Sociology',
    value: Subcategory['Social Science Sociology'],
    category: Category['Social Science'],
  },
  {
    label: 'Philosophy Other',
    value: Subcategory['Philosophy Other'],
    category: Category.Philosophy,
  },
  {
    label: 'Social Science Linguistics',
    value: Subcategory['Social Science Linguistics'],
    category: Category['Social Science'],
  },
  {
    label: 'Social Science Anthropology',
    value: Subcategory['Social Science Anthropology'],
    category: Category['Social Science'],
  },
  {
    label: 'Fine Arts Opera',
    value: Subcategory['Fine Arts Opera'],
    category: Category['Fine Arts'],
  },
];

export const SUBCATEGORY_MAP = SUBCATEGORIES.reduce<
  { [key in Subcategory]: Category }
>(
  (acc, sc) => ({ ...acc, [sc.value]: sc.category }),
  {} as { [key in Subcategory]: Category }
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
