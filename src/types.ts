export enum Category {
  Mythology = 14,
  Literature = 15,
  Trash = 16,
  Science = 17,
  History = 18,
  Religion = 19,
  Geography = 20,
  'Fine Arts' = 21,
  'Social Science' = 22,
  Philosophy = 25,
  'Current Events' = 26,
}

export enum Subcategory {
  'Literature European' = 1,
  'Fine Arts Visual' = 2,
  'Literature American' = 4,
  'Science Chemistry' = 5,
  'History British' = 6,
  'Fine Arts Auditory' = 8,
  'Science Other' = 10,
  'History American' = 13,
  'Science Biology' = 14,
  'History Classical' = 16,
  'Science Physics' = 18,
  'History World' = 20,
  'Literature British' = 22,
  'Science Computer Science' = 23,
  'History European' = 24,
  'Fine Arts Other' = 25,
  'Science Math' = 26,
  'Fine Arts Audiovisual' = 27,
  'History Other' = 28,
  'Literature Other' = 29,
  'Literature Classical' = 30,
  'Religion American' = 31,
  'Trash American' = 32,
  'Mythology American' = 33,
  'Social Science American' = 34,
  'Fine Arts American' = 35,
  'Science American' = 36,
  'Science World' = 37,
  'Geography American' = 38,
  'Philosophy American' = 39,
  'Current Events American' = 40,
  'Current Events Other' = 42,
  'Fine Arts World' = 43,
  'Geography World' = 44,
  'Fine Arts British' = 45,
  'Mythology Indian' = 46,
  'Mythology Chinese' = 47,
  'Mythology Other East Asian' = 49,
  'Mythology Japanese' = 48,
  'Fine Arts European' = 50,
  'Religion East Asian' = 51,
  'Philosophy East Asian' = 52,
  'Trash Video Games' = 53,
  'Mythology Other' = 54,
  'Trash Sports' = 55,
  'Social Science Economics' = 56,
  'Religion Christianity' = 57,
  'Mythology Greco-Roman' = 58,
  'Trash Other' = 59,
  'Social Science Other' = 60,
  'Philosophy Classical' = 61,
  'Literature World' = 12,
  'Religion Other' = 62,
  'Mythology Norse' = 63,
  'Social Science Political Science' = 64,
  'Mythology Egyptian' = 65,
  'Philosophy European' = 66,
  'Trash Music' = 67,
  'Religion Islam' = 68,
  'Religion Judaism' = 69,
  'Trash Television' = 70,
  'Social Science Psychology' = 71,
  'Trash Movies' = 72,
  'Social Science Sociology' = 73,
  'Philosophy Other' = 74,
  'Social Science Linguistics' = 75,
  'Social Science Anthropology' = 76,
  'Fine Arts Opera' = 77,
}

export enum Difficulty {
  'Middle School' = 1,
  'Easy High School',
  'Regular High School',
  'Hard High School',
  'National High School',
  'Easy College',
  'Regular College',
  'Hard College',
  'Open',
}

export type Tossup = {
  text: string;
  answer: string;
  formattedText: string;
  formattedAnswer: string;
  category: Category;
  subcategory: Subcategory;
  difficulty: Difficulty;
  tournament: string;
};

export enum TossupResultScore {
  neg = -5,
  get = 10,
  power = 15,
}

export type TossupResult = {
  submittedAnswer: string;
  isCorrect: boolean;
  score: TossupResultScore;
};

export type TossupBuzz = {
  isInPower: boolean;
  readText: string;
  index: number;
};
