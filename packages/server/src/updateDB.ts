/* eslint-disable no-console */
/**
 * Mainly used for creating normalized answers in the `normalized_answer` field
 * in the tossups table. May have other utilities in the future.
 */

import nlp from 'compromise';
import { Client } from 'pg';

type RegexReplace = [RegExp, string];
const between: RegexReplace = [/\(.*\)|\[.*|<.*>|&lt;.*&gt;.*/g, ''];
const spacePunctuation: RegexReplace = [/[-–_,*/]/g, ' '];
const usefulPunctuation: RegexReplace = [/[`;;.!?/]/g, ''];
const uselessPunctuation: RegexReplace = [/[`~@#$%^&()+=[\]{}|\\:<>]/g, ''];
const quotes: RegexReplace = [/["'\u2018\u2019\u201C\u201D]/g, ''];
const shrinkSpace: RegexReplace = [/\s\s+/g, ' '];
const words: RegexReplace = [/note to moderator.*|bonuses:.*/g, ''];

const normalizeAnswer = (answer: string) =>
  nlp(
    answer
      .toLowerCase()
      .replaceAll(...between)
      .replaceAll(...quotes)
      .replaceAll(...spacePunctuation)
      .replaceAll(...uselessPunctuation)
      .replaceAll(...usefulPunctuation)
      .replaceAll(...words)
      .replaceAll(...shrinkSpace)
      .trim(),
  )
    .normalize()
    .out('text')
    .toLowerCase()
    .replaceAll(...shrinkSpace)
    .trim();

const promiseAllWithProgress = (promises: Promise<any>[]) => {
  let finished = 0;
  promises.forEach((p) =>
    p.then(() => {
      finished += 1;
      if (finished % 10000 === 0) {
        console.log(`Finished ${finished} updates.`);
      }
      if (finished === promises.length) {
        console.log('Finished all updates');
      }
    }),
  );
  return Promise.all(promises);
};

const client = new Client();
(async () => {
  await client.connect();
  console.log(`Connected to database ${client.database}.`);

  console.log('Adding a `normalized_answer` field to the `tossups` table.');

  console.log('Retrieving all tossup answers.');
  const { rows } = await client.query<{ answer: string; id: number }>(
    'SELECT id,answer FROM tossups;',
  );
  console.log('Finished retrieving all tossup answers.');
  console.log(`Found ${rows.length} tossup answers.`);

  console.log('Inserting `normalized_answer` into `tossups`.');
  const updates = rows.map(async ({ answer, id }, i) => {
    if (i % 10000 === 0) {
      console.log(`Queuing update for tossup ${i}`);
    }
    if (i === rows.length) {
      console.log('Finished queueing updates.');
    }

    const normalizedAnswer = normalizeAnswer(answer);
    return client.query(
      `UPDATE tossups SET normalized_answer='${normalizedAnswer}' WHERE id=${id}`,
    );
  });
  return promiseAllWithProgress(updates);
})().then(() => {
  console.log('Finished inserting `normalized_answer` into `tossups`.');
  client.end().then(() => console.log('Postgres client disconnected.'));
});
