import { QuestionFilters } from '../types/questions';
import { client, QueryBuilder } from '../utils/db';
import logger from '../utils/logger';

const columns = [
  { name: 'text' },
  { name: 'answer' },
  { name: 'formatted_text' },
  { name: 'formatted_answer' },
  { name: 'normalized_answer' },
  { name: 'category_id', alias: 'category' },
  { name: 'subcategory_id', alias: 'subcategory' },
  { name: 'difficulty' },
  { name: 'name', alias: 'tournament' },
  { name: 'year' },
];

export const getTossups = (questionFilters: QuestionFilters) => {
  const [query, values] = new QueryBuilder()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tournament_id', 'tournaments.id')
    .questionFilter(questionFilters)
    .random()
    .limit(questionFilters.limit)
    .build();

  logger.info(`Tossups SQL Query:\n${query}`);
  logger.info(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  return client.query(query, values);
};
