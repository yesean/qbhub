import { Bag, Clue, ClueBagMap, PlainTossup } from 'clues';
import nlp from 'compromise';
import ngrams from 'compromise-ngrams';
import sentences from 'compromise-sentences';
import { each } from './array';

const nlpEx = nlp.extend(ngrams).extend(sentences);

type RegexReplace = [RegExp | string, string];
const punctuation = (includeSeparators: boolean = true): RegexReplace => [
  includeSeparators ? /["'()/\\*.,?]/g : /["'()/\\*?]/g,
  '',
];
const hyphen: RegexReplace = [/-/g, ' '];
const ftp: RegexReplace = ['for 10 points', ' '];
const shrinkSpace: RegexReplace = [/\s\s+/g, ' '];
const quotes: RegexReplace = [/["'\u2018\u2019\u201C\u201D]/g, ''];

/**
 * Normalizes a clues string. Removes non-alphanumeric characters. Fixes
 * whitespace issues. Converts all to lowercase.
 */
export const normalize = (s: Clue) =>
  s
    .toLowerCase()
    .replaceAll(...punctuation(false))
    .replaceAll(...hyphen)
    .replaceAll(...ftp)
    .replaceAll(...shrinkSpace)
    .trim();

/**
 * Parses clues from an array of tossups.
 */
export const getAllClues = (clues: PlainTossup[]): Clue[] =>
  Array.from(
    new Set(
      clues
        .map(({ text }) =>
          nlpEx(text.replaceAll(...quotes))
            // .ngrams({ size: 5 })
            // .map((sen: any) => sen.normal),
            .sentences()
            .json()
            .map((sen: any) => sen.text),
        )
        .flat()
        .map(normalize)
        .map((sen) => nlpEx(sen).clauses().out('array'))
        .flat()
        .map((s) => s.replaceAll(...punctuation()))
        .sort((a, b) => b.length - a.length),
    ),
  );

/**
 * Gets a bag of words model from a string.
 */
const getBag = (clue: Clue) => {
  const doc = nlpEx(clue);
  const ignore = new Set(
    [
      doc.conjunctions(),
      doc.prepositions(),
      doc.match('#Determiner'),
      doc.match('#Possessive && #Pronouns'),
    ]
      .map((extDoc) => extDoc.out('array'))
      .flat(),
  );

  return clue
    .split(' ')
    .filter((w) => !ignore.has(w))
    .reduce<Bag>((acc, w) => {
      if (w in acc) {
        acc[w] += 1;
      } else {
        acc[w] = 1;
      }
      return acc;
    }, {});
};

/**
 * Gets a ClueBagMap from an array of clues.
 */
const getClueBagMap = (clues: Clue[]) =>
  clues.reduce<ClueBagMap>(each(getBag), {});

/**
 * Gets a bag of words model from a collection of clues. However, the term
 * frequency in a corpus, is not its total frequency but rather the number of
 * clues (documents) that it is contained in (i.e. document frequency).
 */
const getCorpusBag = (clueBagMap: ClueBagMap) =>
  Object.values(clueBagMap).reduce<Bag>((acc, bag) => {
    const words = Object.keys(bag);
    words.forEach((word) => {
      if (word in acc) {
        acc[word] += 1;
      } else {
        acc[word] = 1;
      }
    });
    return acc;
  }, {});

/**
 * Remove a clue from the corpus bag.
 */
const removeClue = (clue: Clue, clueBagMap: ClueBagMap, corpusBag: Bag) => {
  const words = Object.keys(clueBagMap[clue]);
  words.forEach((word) => {
    corpusBag[word] -= 1;
  });
};

/**
 * Calculates the tf-idf score of a word against a clue (document) and the
 * entire corpus of clues.
 * corpusWeight is used to scale the effect of inverse document frequency.
 */
const tfIdf = (
  word: string,
  clueBag: Bag,
  corpusBag: Bag,
  numClues: number,
) => {
  const corpusWeight = 1;
  const documentWeight = corpusBag[word] ?? 0;

  const tf = clueBag[word] ?? 0;
  const idf = Math.log(numClues / (1 + corpusWeight * documentWeight)); // add one to avoid division by zero
  return tf * idf;
};

/**
 * Scores a word against a clue and the corpus.
 */
const scoreWord = (
  word: string,
  clue: Clue,
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
  numClues: number,
) => tfIdf(word, clueBagMap[clue], corpusBag, numClues);

/**
 * Scores a clue against a clue and the corpus.
 */
const scoreClue = (
  queryClue: Clue,
  baseClue: Clue,
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
  numClues: number,
) => {
  const words = Object.keys(clueBagMap[queryClue]);
  const totalScore = words
    .map((word) => scoreWord(word, baseClue, clueBagMap, corpusBag, numClues))
    .reduce((sum, score) => sum + score);
  return totalScore;
};

/**
 * Gets a unique array of clues, consolidating *similar* clues together.
 */
const combineClues = (
  clues: Clue[],
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
) => {
  const uniqueClues: [string, number][] = [];
  while (clues.length > 0) {
    const SCORE_THRESHOLD = 2.5 * (1 * Math.log(clues.length / (1 + 6)));
    const queryClue = clues[0];

    const toRemove = new Map([[0, 0]]);
    for (let i = 1; i < clues.length; i += 1) {
      const clueScore = scoreClue(
        queryClue,
        clues[i],
        clueBagMap,
        corpusBag,
        clues.length,
      );
      if (clueScore > SCORE_THRESHOLD) {
        toRemove.set(i, clueScore);
      }
    }
    const highestCluePair = Array.from(toRemove.entries()).reduce((acc, e) =>
      e[1] > acc[1] ? e : acc,
    );
    const highestClue = clues[highestCluePair[0]];
    uniqueClues.push([highestClue, highestCluePair[1]]);
    const cluesCopy = clues.slice();
    toRemove.forEach((_, idx) =>
      removeClue(cluesCopy[idx], clueBagMap, corpusBag),
    );
    clues = clues.filter((_, idx) => !toRemove.has(idx));
  }
  const roundToHundreths = (n: number) => Math.round(n * 100) / 100;
  return uniqueClues
    .sort((a, b) => b[1] - a[1])
    .map(([clue, score]) => ({ clue, score: roundToHundreths(score) }));
};

/**
 * Wrapper function for combineClues.
 */
export const getUniqueClues = (clues: Clue[]) => {
  const clueBagMap = getClueBagMap(clues);
  // remove useless clues
  clues = clues.filter((clue) => {
    if (Object.keys(clueBagMap[clue]).length === 0) {
      delete clueBagMap[clue];
      return false;
    }
    return true;
  });
  const corpusBag = getCorpusBag(clueBagMap);
  return combineClues(clues, clueBagMap, corpusBag);
};
