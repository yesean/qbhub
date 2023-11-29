import { FrequencyListEntry, QuestionParameters } from '@qbhub/types';
import { log } from '@qbhub/utils';
import { Order } from '../types/db.js';
import { TABLES } from '../utils/constants.js';
import { QueryBuilder, client } from '../utils/db.js';

const columns = [
  { alias: 'answer', name: TABLES.tossups.columns.normalizedAnswer },
  { alias: 'frequency', name: 'count(normalized_answer)' },
];
const columnOrder: Order = [
  { direction: 'desc', name: 'count(normalized_answer)' },
  { direction: 'asc', name: TABLES.tossups.columns.normalizedAnswer },
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
