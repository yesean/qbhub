import { QuestionFilters } from '../types/questions';
import { client, QueryBuilder } from '../utils/db';
import logger from '../utils/logger';

const columns = [
  { name: 'name', alias: 'tournament' },
  { name: 'text' },
  { name: 'normalized_answer', alias: 'answer' },
];

export const getClues = (questionFilters: QuestionFilters) => {
  const [query, values] = new QueryBuilder()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tournament_id', 'tournaments.id')
    .questionFilter(questionFilters, {
      useNormalizedAnswer: true,
      useExactAnswer: true,
    })
    .limit(questionFilters.limit)
    .build();

  logger.info(`Clues SQL Query:\n${query}`);
  logger.info(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  return client.query(query, values);
};
