require('dotenv').config();
const fs = require('fs');
const { Client } = require('pg');
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
nlp.extend(require('compromise-ngrams'));

const normalize = (s) => {
  return s.replaceAll(/\s\s+/g, ' ').replaceAll(/\./g, '').trim().toLowerCase();
};

const time =
  (f, description) =>
  (...args) => {
    console.time('execution time');
    description && console.log('beginning to', description, '...');
    const result = f(...args);
    description && console.log('finished', description);
    console.timeEnd('execution time');
    return result;
  };

const pgInit = () => {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT),
  });
  client.connect();
  return client;
};
const pgInitTimed = time(pgInit, 'connect to pg');

const writeClues = (clues) => {
  fs.writeFile('clues.json', JSON.stringify({ clues }), console.error);
};
const writeCluesTimed = time(writeClues, 'write clues to file');

// get bag of words for a single clue, exclude irrelevant words
const getBag = (s) => {
  const conjunctions = new Set([...nlp(s).conjunctions().out('array')]);
  const prepositions = new Set([...nlp(s).prepositions().out('array')]);
  const determiners = new Set([...nlp(s).match('#Determiner').out('array')]);
  const possessivePronouns = new Set([
    ...nlp(s).match('(#Possessive && #Pronouns)').out('array'),
  ]);
  return normalize(s)
    .split(' ')
    .filter((w) => !conjunctions.has(w))
    .filter((w) => !prepositions.has(w))
    .filter((w) => !determiners.has(w))
    .filter((w) => !possessivePronouns.has(w))
    .reduce((acc, w) => {
      if (w in acc) {
        acc[w]++;
      } else {
        acc[w] = 1;
      }
      return acc;
    }, {});
};

// get inidividual sentences from tossups
const extractSentences = (rows) => {
  const sentences = rows.flatMap((r) =>
    nlp(r.text)
      .sentences()
      .normalize('heavy')
      .json()
      .map((s) => s.text.replaceAll(/\"|\'/g, '').toLowerCase()),
  );
  return sentences;
};
const extractSentencesTimed = time(extractSentences, 'normalize tossups');

// get bag of words for each clue
const calculateCluesBow = (clues) => {
  return clues.reduce((acc, clue) => ({ ...acc, [clue]: getBag(clue) }), {});
};
const calculateCluesBowTimed = time(
  calculateCluesBow,
  'calculate clues bag of words',
);

// get bag of words for entire corpus
const calculateCorpusBow = (cluesBag) => {
  return Object.values(cluesBag).reduce((acc, bag) => {
    Object.keys(bag).forEach((key) => {
      if (key in acc) {
        acc[key]++;
      } else {
        acc[key] = 1;
      }
    });
    return acc;
  }, {});
};
const calculateCorpusBowTimed = time(
  calculateCorpusBow,
  'calculate corpus bag of words',
);

const calculateTfIdf = (term, clueBag, corpusBag, numClues) => {
  const tf = clueBag[term] ?? 0;
  const idf = numClues / (1 + 5 * (corpusBag[term] ?? 0));
  return tf * idf;
};

const scoreClue = (clueBag, otherClueBag, corpusBag, numClues) => {
  const termScores = Object.keys(clueBag).reduce(
    (acc, term) => ({
      ...acc,
      [term]: calculateTfIdf(term, otherClueBag, corpusBag, numClues),
    }),
    0,
  );
  const sum = (arr) => arr.reduce((acc, e) => acc + e);
  const clueScore = sum(Object.values(termScores));
  return [clueScore, termScores];
};

const queryClue = (query, cluesBag, corpusBag, minScore = 0) => {
  const numClues = Object.keys(cluesBag).length;
  const scores = Object.keys(cluesBag).reduce((acc, clue) => {
    const score = scoreClue(
      cluesBag[query],
      cluesBag[clue],
      corpusBag,
      numClues,
    );
    if (score[0] >= minScore)
      return {
        ...acc,
        [clue]: score,
      };
    else return acc;
  }, {});
  return Object.entries(scores).sort((a, b) => b[1][0] - a[1][0]);
};
// const queryClueTimed = time(queryClue, 'query clue');

const removeClues = (clues, cluesBag) => {
  clues.forEach((clue) => delete cluesBag[clue]);
};

const combineClues = (cluesBag, corpusBag) => {
  const MIN_SCORE = 20;
  const clues = Object.keys(cluesBag);
  const seen = new Set();
  clues.forEach((clue) => {
    if (clue in cluesBag && !seen.has(clue)) {
      const relatedClues = queryClue(clue, cluesBag, corpusBag, MIN_SCORE);
      console.log('number of related clues:', relatedClues.length);
      if (relatedClues.length > 1) {
        const relatedCluesText = relatedClues.map((c) => c[0]);
        const longestClue = relatedCluesText.reduce((longest, clue) =>
          clue.length > longest.length ? clue : longest,
        );
        const highestClue = relatedClues.slice(1).reduce(
          (acc, c) => {
            if (c[1][0] > acc[1]) return [c[0], c[1][0]];
            else return acc;
          },
          ['', 0],
        )[0];
        seen.add(highestClue);
        console.log('highest clue:', highestClue);
        console.log('adding to seen, current size:', seen.size);
        // const cluesToDelete = relatedCluesText.filter((c) => c !== longestClue);
        const cluesToDelete = relatedCluesText.filter((c) => c !== highestClue);
        console.log(
          'found',
          relatedClues.length,
          'deleting',
          cluesToDelete.length,
        );
        // console.log('combining', cluesToDelete.length, 'clues into one');
        removeClues(cluesToDelete, cluesBag);
      } else {
        delete cluesBag[clue];
      }
    }
  });
  return Object.keys(cluesBag);
};
const combineCluesTimed = time(combineClues, 'combine clues');

const ANSWER = 'rainer maria rilke';
const client = pgInitTimed();
console.time('execution time');
console.log('querying tossups...');
client
  .query(`select text from tossups where normalized_answer = '${ANSWER}';`)
  .then(({ rows }) => {
    console.log('finished querying tossups');
    console.timeEnd('execution time');

    const sentences = extractSentencesTimed(rows, 'extract sentences');
    const cluesBag = calculateCluesBowTimed(sentences);
    const corpusBag = calculateCorpusBowTimed(cluesBag);
    const combinedClues = combineCluesTimed(cluesBag, corpusBag)
      .filter((s) => !s.includes('for 10 point'))
      .filter((s) => s.length > 5);

    console.log('number of sentences:', sentences.length);
    console.log('number of clues:', combinedClues.length);

    /* const randomClue =
      Object.keys(cluesBag)[
        Math.floor(Math.random() * Object.keys(cluesBag).length)
      ];
    const relatedClues = queryClueTimed(randomClue, cluesBag, corpusBag, 20);

    console.log('\nquery clue:', randomClue, '\n');
    console.log(JSON.stringify(relatedClues, null, 2)); */
    writeCluesTimed(combinedClues);
    client.end();
  });
