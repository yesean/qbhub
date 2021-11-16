import nlp from 'compromise';
import sentences from 'compromise-sentences';
import ngrams from 'compromise-ngrams';
import { MiniTossup } from 'clues';

const nlpEx = nlp.extend(ngrams).extend(sentences);

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replaceAll(/[-]/g, ' ')
    .replaceAll(/["',()?*.]/g, '')
    .replaceAll('for 10 points', '')
    .replaceAll(/\s\s+/g, ' ')
    .trim();

export const getSentences = (clues: MiniTossup[]) =>
  clues
    .map(({ text }) =>
      nlpEx(text)
        // .ngrams({ size: 5 })
        // .map((sen: any) => sen.normal),
        .sentences()
        .json()
        .map((sen: any) => sen.text),
    )
    .flat()
    .map(normalize)
    .map((sen) => nlpEx(sen).clauses().out('array'))
    .flat();

type Clue = string;
type Bag = {
  [word: string]: number;
};
type ClueBagMap = {
  [clue: Clue]: Bag;
};

const getBag = (s: string) => {
  const doc = nlpEx(s);
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

  return s
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

const getClueBagMap = (clues: Clue[]) =>
  clues.reduce<ClueBagMap>(
    (acc, clue) => ({ ...acc, [clue]: getBag(clue) }),
    {},
  );

const getCorpusBag = (clueBagMap: ClueBagMap) =>
  Object.values(clueBagMap).reduce<Bag>((acc, bag) => {
    Object.keys(bag).forEach((key) => {
      if (key in acc) {
        acc[key] += 1;
      } else {
        acc[key] = 1;
      }
    });
    return acc;
  }, {});

const removeClue = (clue: Clue, clueBagMap: ClueBagMap, corpusBag: Bag) => {
  const words = Object.keys(clueBagMap[clue]);
  words.forEach((word) => {
    corpusBag[word] -= 1;
  });
};

const tfIdf = (
  word: string,
  clueBag: Bag,
  corpusBag: Bag,
  numClues: number,
) => {
  const corpusWeight = 1;

  const tf = clueBag[word] ?? 0;
  const idf = numClues / (1 + corpusWeight * (corpusBag[word] ?? 0)); // add one to avoid division by zero
  return tf * idf;
};

const queryWord = (
  word: string,
  clue: Clue,
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
  numClues: number,
) => tfIdf(word, clueBagMap[clue], corpusBag, numClues);

const scoreClue = (
  queryClue: Clue,
  baseClue: Clue,
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
  numClues: number,
) => {
  const words = Object.keys(clueBagMap[queryClue]);
  const totalScore = words
    .map((word) => queryWord(word, baseClue, clueBagMap, corpusBag, numClues))
    .reduce((sum, score) => sum + score, 0);
  return totalScore;
};

const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const combineClues = (
  clues: Clue[],
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
) => {
  const SCORE_THRESHOLD = 30;
  const uniqueClues = [];
  while (clues.length > 0) {
    const baseClue = clues[0];

    const toRemove = new Set([0]);
    for (let i = 1; i < clues.length; i += 1) {
      const clueScore = scoreClue(
        clues[i],
        baseClue,
        clueBagMap,
        corpusBag,
        clues.length,
      );
      if (clueScore >= SCORE_THRESHOLD) {
        toRemove.add(i);
      }
    }
    // const longestClue = [...toRemove].reduce<Clue>(
    //   (acc, idx) =>
    //     Object.keys(clueBagMap[clues[idx]]).length >
    //     Object.keys(clueBagMap[acc]).length
    //       ? clues[idx]
    //       : acc,
    //   baseClue,
    // );
    const randomClue = clues[random([...toRemove])];
    uniqueClues.push([toRemove.size, randomClue]);
    toRemove.forEach((idx) => removeClue(clues[idx], clueBagMap, corpusBag));
    clues = clues.filter((_, idx) => !toRemove.has(idx));
  }
  return uniqueClues.sort((a, b) => (b[0] as number) - (a[0] as number));
};

export const getUniqueClues = (clues: Clue[]) => {
  const clueBagMap = getClueBagMap(clues);
  const corpusBag = getCorpusBag(clueBagMap);
  return combineClues(clues, clueBagMap, corpusBag);
};
