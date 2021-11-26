import { Order } from 'db';
import { QuestionFilters } from '../types/questions';
import { client, QueryBuilder } from '../utils/db';
import logger from '../utils/logger';

const columns = [
  { name: 'normalized_answer', alias: 'answer' },
  { name: 'count(normalized_answer)', alias: 'frequency' },
];
const columnOrder: Order = [
  { name: 'count(normalized_answer)', direction: 'desc' },
  { name: 'normalized_answer', direction: 'asc' },
];

export const getFreq = (questionFilters: QuestionFilters) => {
  const [query, values] = new QueryBuilder()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tournament_id', 'tournaments.id')
    .questionFilter(questionFilters, {
      useNormalizedAnswer: true,
    })
    .groupBy('normalized_answer')
    .orderBy(columnOrder)
    .limit(questionFilters.limit)
    .offset(questionFilters.offset)
    .build();

  logger.info(`Freq SQL Query:\n${query}`);
  logger.info(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  return client.query(query, values);
};
