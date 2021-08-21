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
  category: Category;
  difficulty: Difficulty;
  tournament: string;
};
