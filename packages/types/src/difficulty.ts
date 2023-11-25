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

export const getDifficultyName = (difficulty: Difficulty) =>
  Difficulty[difficulty];
