import { QuestionFilters } from '../types/controller';
import { Tossup } from '../types/db';
import { TABLES } from '../utils/constants';
import { client, QueryBuilder } from '../utils/db';
import logger from '../utils/logger';
import { transformTossup } from '../utils/model';

const columns = [
  { name: TABLES.tossups.columns.text },
  { name: TABLES.tossups.columns.answer },
  { name: TABLES.tossups.columns.formattedText },
  { name: TABLES.tossups.columns.formattedAnswer },
  { name: TABLES.tossups.columns.normalizedAnswer },
  { name: TABLES.tossups.columns.category, alias: 'category' },
  { name: TABLES.tossups.columns.subcategory, alias: 'subcategory' },
  { name: TABLES.tournaments.columns.difficulty },
  { name: TABLES.tournaments.columns.name, alias: 'tournament' },
  { name: TABLES.tournaments.columns.year },
];

export const getTossups = async (questionFilters: QuestionFilters) => {
  const [query, values] = new QueryBuilder()
    .select(columns)
    .from(TABLES.tossups.name)
    .innerJoin(
      TABLES.tournaments.name,
      TABLES.tossups.columns.tournament,
      TABLES.tournaments.columns.id,
    )
    .filterTossups(questionFilters)
    .random()
    .limit(questionFilters.limit)
    .build();

  logger.info(`Tossups SQL Query:\n${query}`);
  logger.info(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  const { rows: tossups } = await client.query<Tossup>(query, values);
  return tossups.map(transformTossup);
};
