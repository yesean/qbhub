import { Freq, Order } from '../types/db';
import { QuestionFilters } from '../types/controller';
import { TABLES } from '../utils/constants';
import { client, QueryBuilder } from '../utils/db';
import logger from '../utils/logger';

const columns = [
  { name: TABLES.tossups.columns.normalizedAnswer, alias: 'answer' },
  { name: 'count(normalized_answer)', alias: 'frequency' },
];
const columnOrder: Order = [
  { name: 'count(normalized_answer)', direction: 'desc' },
  { name: TABLES.tossups.columns.normalizedAnswer, direction: 'asc' },
];

export const getFreq = async (questionFilters: QuestionFilters) => {
  const [query, values] = new QueryBuilder()
    .select(columns)
    .from(TABLES.tossups.name)
    .innerJoin(
      TABLES.tournaments.name,
      TABLES.tossups.columns.tournament,
      TABLES.tournaments.columns.id,
    )
    .questionFilter(questionFilters, {
      useNormalizedAnswer: true,
    })
    .groupBy(TABLES.tossups.columns.normalizedAnswer)
    .orderBy(columnOrder)
    .limit(questionFilters.limit)
    .offset(questionFilters.offset)
    .build();

  logger.info(`Freq SQL Query:\n${query}`);
  logger.info(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  const { rows: freq } = await client.query<Freq>(query, values);
  return freq;
};
