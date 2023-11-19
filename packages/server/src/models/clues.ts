import { QuestionParameters } from '@qbhub/types';
import { log } from '@qbhub/utils';
import { PlainTossup } from '../types/db';
import { getAllClues, getUniqueClues } from '../utils/clues';
import { TABLES } from '../utils/constants';
import { client, QueryBuilder } from '../utils/db';

const columns = [
  { name: TABLES.tossups.columns.text },
  { name: TABLES.tossups.columns.normalizedAnswer, alias: 'answer' },
  { name: TABLES.tournaments.columns.name, alias: 'tournament' },
];

/**
 * Retrieves and formats unique clues sorted by relevance from the database.
 */
export const getClues = async (questionFilters: QuestionParameters) => {
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
      useExactAnswer: true,
    })
    .limit(questionFilters.limit)
    .build();

  log.info(`Clues SQL Query:\n${query}`);
  log.info(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  const { rows: tossups } = await client.query<PlainTossup>(query, values);

  // extract clues from tossups
  log.info('Parsing tossups into clues.');
  const clues = getAllClues(tossups);
  log.info('Extracting unique clues from all clues.');
  return getUniqueClues(clues);
};
