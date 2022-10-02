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

const client = new Client();
(async () => {
  await client.connect();
  console.log('querying from tossups.');
  const { rows } = await client.query<{ id: number; answer: string }>(
    'SELECT id,answer FROM tossups;',
  );
  console.log('beginning to update answers.');
  return Promise.all(
    rows.map(async ({ id, answer }) => {
      const normalizedAnswer = answer
        .toLowerCase()
        .replaceAll(...between)
        .replaceAll(...quotes)
        .replaceAll(...spacePunctuation)
        .replaceAll(...uselessPunctuation)
        .replaceAll(...usefulPunctuation)
        .replaceAll(...words)
        .replaceAll(...shrinkSpace)
        .trim();
      const postComp = nlp(normalizedAnswer)
        .normalize()
        .out('text')
        .toLowerCase()
        .replaceAll(...shrinkSpace)
        .trim();
      return client.query(
        `UPDATE tossups SET normalized_answer='${postComp}' WHERE id=${id}`,
      );
    }),
  );
})().then(() => console.log('done updating answers..'));
