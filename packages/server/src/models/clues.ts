import { QuestionParameters } from '@qbhub/types';
import { log } from '@qbhub/utils';
import { PlainTossup } from '../types/db.js';
import { getAllClues, getUniqueClues } from '../utils/clues.js';
import { TABLES } from '../utils/constants.js';
import { QueryBuilder, client } from '../utils/db.js';

const columns = [
  { name: TABLES.tossups.columns.text },
  { alias: 'answer', name: TABLES.tossups.columns.normalizedAnswer },
  { alias: 'tournament', name: TABLES.tournaments.columns.name },
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
      useExactAnswer: true,
      useNormalizedAnswer: true,
    })
    .limit(questionFilters.limit)
    .build();

  log.debug(`Clues SQL Query:\n${query}`);
  log.debug(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  const { rows: tossups } = await client.query<PlainTossup>(query, values);

  // extract clues from tossups
  log.debug('Parsing tossups into clues.');
  const clues = getAllClues(tossups);
  log.debug('Extracting unique clues from all clues.');
  return getUniqueClues(clues);
};
