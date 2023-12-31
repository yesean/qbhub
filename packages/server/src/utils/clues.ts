import { Bag, Clue, ClueBagMap, SelectedClue } from '@qbhub/types';
import { log, roundNumber } from '@qbhub/utils';
import stats from '@seanye/compromise-stats';
import _nlp from 'compromise/three';
import { PlainTossup } from '../types/db.js';
import { each, max, shuffle, sum, unique } from './array.js';

const nlp = _nlp.plugin(stats);

type RegexReplace = [RegExp | string, string];
const quotes: RegexReplace = [/["'\u2018\u2019\u201C\u201D]/g, ''];
const between: RegexReplace = [/\(.*\)|\[.*\]|<.*>|&lt;.*&gt;.*/g, ''];
const uselessPunctuation: RegexReplace = [/[`~@#$%^&()+=[\]{}|\\:<>]/g, ''];

const spacePunctuation: RegexReplace = [/[-–_,*/]/g, ' '];
const usefulPunctuation: RegexReplace = [/[`;;.!?/]/g, ''];
const ftp: RegexReplace = [/for (?:10|ten) points/g, ''];
const shrinkSpace: RegexReplace = [/\s\s+/g, ' '];

/**
 * Normalizes a tossup for splitting into sentences.
 */
export const normalizeTossup = (s: string) =>
  s
    .toLowerCase()
    .replaceAll(...quotes)
    .replaceAll(...between)
    .replaceAll(...uselessPunctuation)
    .replaceAll(...shrinkSpace)
    .trim();

/**
 * Normalizes a clue for scoring.
 */
export const normalizeClue = (s: string) =>
  s
    .toLowerCase()
    .replaceAll(...ftp)
    .replaceAll(...spacePunctuation)
    .replaceAll(...usefulPunctuation)
    .replaceAll(...shrinkSpace)
    .replaceAll(...shrinkSpace)
    .trim();

/**
 * Split a string into sentences.
 */
export const getSentences = (s: string): string[] =>
  nlp(normalizeTossup(s)) // remove quotes since quotes after periods hurt parsing
    .sentences()
    .json()
    .map(({ text }: any) => text);

/**
 * Split a string into clauses.
 */
export const getClauses = (s: string): string[] =>
  nlp(s).clauses().out('array');

/**
 * Parses clues from an array of tossups.
 */
export const getAllClues = (tossups: PlainTossup[]): Clue[] => {
  const allClues = tossups
    .map(({ text, tournament }) => {
      const sens = getSentences(text);
      const clues = sens
        .map((sentence) => {
          const normalizedSentence = normalizeClue(sentence);
          return getClauses(sentence).map((clause) => {
            const clueText = normalizeClue(clause);
            return {
              sentence: normalizedSentence,
              text: clueText,
              tournament,
            };
          });
        })
        .flat();
      return clues;
    })
    .flat();
  const uniqueClues = allClues.reduce<[Clue[], Set<string>]>(
    unique<Clue>((clue) => clue.text),
    [[], new Set()],
  )[0];
  return shuffle(uniqueClues);
};

/**
 * Gets a bag of words model from a string.
 */
const getBag = (clue: string) => {
  const doc = nlp(clue);
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

  const words = clue.split(' ');
  const meaningfulWords = words.filter((w) => !ignore.has(w));
  const bag = meaningfulWords.reduce<Bag>((acc, word) => {
    if (word in acc) {
      acc[word] += 1;
    } else {
      acc[word] = 1;
    }
    return acc;
  }, {});

  return bag;
};

/**
 * Gets a ClueBagMap from an array of clues, mapping each clue to its bag.
 */
const getClueBagMap = (clues: Clue[]) =>
  clues.map(({ text }) => text).reduce<ClueBagMap>(each(getBag), {});

/**
 * Gets a bag of words model from a collection of clues. The term
 * frequency in the corpus is not its total frequency but rather the number of
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
  const words = Object.keys(clueBagMap[clue.text]);
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
  const idfWeight = 1;
  const documentFrequency = corpusBag[word] ?? 0;

  const tf = clueBag[word] ?? 0;
  const idf = Math.log(numClues / (1 + idfWeight * documentFrequency)); // add one to avoid division by zero
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
) => tfIdf(word, clueBagMap[clue.text], corpusBag, numClues);

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
  const words = Object.keys(clueBagMap[queryClue.text]);
  const score = words
    .map((word) => scoreWord(word, baseClue, clueBagMap, corpusBag, numClues))
    .reduce(sum());
  return score;
};

/**
 * Gets a unique array of clues, consolidating *similar* clues together.
 */
const combineClues = (
  clues: Clue[],
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
): SelectedClue[] => {
  const uniqueClues: SelectedClue[] = [];
  while (clues.length > 0) {
    // ideally, tf > 2.5 and idf < 6
    const [NUM_TERMS, TF, DF, IDF_WEIGHT] = [2.5, 1, 6, 1];
    const SCORE_THRESHOLD =
      NUM_TERMS * (TF * Math.log(clues.length / (1 + IDF_WEIGHT * DF)));

    const queryClue = clues[0]; // use first clue as the search query
    const clueScores = new Map<number, number>([[0, 0]]); // maps clue index to clue score
    const similarClues = [0]; // indices of clues to remove

    // score clues compared to first clue
    for (let i = 1; i < clues.length; i += 1) {
      const score = scoreClue(
        queryClue,
        clues[i],
        clueBagMap,
        corpusBag,
        clues.length,
      );
      if (score > SCORE_THRESHOLD) {
        clueScores.set(i, score);
        similarClues.push(i);
      }
    }

    const cluesCopy = [...clues];

    // get clue with best match
    const bestClueIdx = similarClues.reduce(max((e) => clueScores.get(e)!));
    const bestClueScore = clueScores.get(bestClueIdx);
    const matches = similarClues.slice(1).map((i) => ({
      ...cluesCopy[i],
      score: roundNumber(clueScores.get(i)!, 2),
    }));
    uniqueClues.push({
      ...queryClue,
      matches,
      score: bestClueScore,
    } as SelectedClue);

    // remove similar clues
    similarClues.forEach((idx) =>
      removeClue(cluesCopy[idx], clueBagMap, corpusBag),
    );
    clues = clues.filter((_, idx) => !clueScores.has(idx));
  }

  // sort clues by score
  return uniqueClues
    .sort((a, b) => b.score - a.score)
    .map((clue) => ({ ...clue, score: roundNumber(clue.score, 2) }));
};

/**
 * Wrapper function for combineClues.
 */
export const getUniqueClues = (clues: Clue[]) => {
  log.debug('Calculating bag of words for each clue.');
  const clueBagMap = getClueBagMap(clues);

  // remove useless clues
  log.debug('Removing useless clues.');
  clues = clues.filter((clue) => {
    if (Object.keys(clueBagMap[clue.text]).length === 0) {
      delete clueBagMap[clue.text];
      return false;
    }
    return true;
  });

  log.debug('Calculating bag of words for corpus.');
  const corpusBag = getCorpusBag(clueBagMap);
  log.debug('Combining clues.');
  return combineClues(clues, clueBagMap, corpusBag);
};
