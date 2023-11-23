import { FrequencyListEntry, QuestionParameters } from '@qbhub/types';
import { log } from '@qbhub/utils';
import { Order } from '../types/db.js';
import { TABLES } from '../utils/constants.js';
import { client, QueryBuilder } from '../utils/db.js';

const columns = [
  { name: TABLES.tossups.columns.normalizedAnswer, alias: 'answer' },
  { name: 'count(normalized_answer)', alias: 'frequency' },
];
const columnOrder: Order = [
  { name: 'count(normalized_answer)', direction: 'desc' },
  { name: TABLES.tossups.columns.normalizedAnswer, direction: 'asc' },
];

/**
 * Retrieves and formats answers sorted by frequency from the database.
 */
export const getFreq = async (questionFilters: QuestionParameters) => {
  const [query, values] = new QueryBuilder()
    .select(columns)
    .from(TABLES.tossups.name)
    .innerJoin(
      TABLES.tournaments.name,
      TABLES.tossups.columns.tournament,
      TABLES.tournaments.columns.id,
    )
    .filterTossups(questionFilters, {
      useNormalizedAnswer: true,
    })
    .groupBy(TABLES.tossups.columns.normalizedAnswer)
    .orderBy(columnOrder)
    .limit(questionFilters.limit)
    .offset(questionFilters.offset)
    .build();

  log.debug(`Freq SQL Query:\n${query}`);
  log.debug(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  const { rows: freq } = await client.query<FrequencyListEntry>(query, values);
  return freq;
};
