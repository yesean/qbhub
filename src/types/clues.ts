export type PlainTossup = {
  text: string;
  answer: string;
};

// represents a tossup clue, generally a short clause or phrase
export type Clue = string;

// bag of words model of a string (i.e. map of form: word -> frequency)
export type Bag = {
  [word: string]: number;
};

// maps a clue to its bag of words model
export type ClueBagMap = {
  [clue: Clue]: Bag;
};
