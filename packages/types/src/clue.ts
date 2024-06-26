import { Tournament } from './tournament.js';

export type Clue = {
  sentence: string;
  text: string;
  tournament: Tournament;
};

export type MatchedClue = Clue & { score: number };
export type SelectedClue = MatchedClue & { matches: MatchedClue[] };

// bag of words model of a string (i.e. map of form: word -> frequency)
export type Bag = {
  [word: string]: number;
};

// maps a clue to its bag of words model
export type ClueBagMap = {
  [clue: string]: Bag;
};
