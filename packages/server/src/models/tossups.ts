import { QuestionFilters, SortOption } from '@qbhub/types';
import { log } from '@qbhub/utils';

import { Order, Tossup } from '../types/db.js';
import { TABLES } from '../utils/constants.js';
import { client, QueryBuilder } from '../utils/db.js';
import { transformTossup } from '../utils/model.js';

const columns = [
  { name: TABLES.tossups.columns.id },
  { name: TABLES.tossups.columns.text },
  { name: TABLES.tossups.columns.answer },
  { name: TABLES.tossups.columns.formattedText },
  { name: TABLES.tossups.columns.formattedAnswer },
  { name: TABLES.tossups.columns.normalizedAnswer },
  { alias: 'category', name: TABLES.tossups.columns.category },
  { alias: 'subcategory', name: TABLES.tossups.columns.subcategory },
  { name: TABLES.tournaments.columns.difficulty },
  { alias: 'tournament', name: TABLES.tournaments.columns.id },
  { name: TABLES.tournaments.columns.year },
];

/**
 * Retrieves and formats tossups from the database.
 */
export const getTossups = async (questionFilters: QuestionFilters) => {
  const order: Order = [
    {
      direction: questionFilters.sort === SortOption.latest ? 'desc' : 'asc',
      name: TABLES.tournaments.columns.year,
    },
  ];

  const partialQuery = new QueryBuilder()
    .select(columns)
    .from(TABLES.tossups.name)
    .innerJoin(
      TABLES.tournaments.name,
      TABLES.tossups.columns.tournament,
      TABLES.tournaments.columns.id,
    )
    .filterTossups(questionFilters);
  if (questionFilters.sort === SortOption.random) {
    partialQuery.random();
  } else {
    partialQuery.orderBy(order);
  }
  const [query, values] = partialQuery.limit(questionFilters.limit).build();

  log.debug(`Tossups SQL Query:\n${query}`);
  log.debug(
    'Parameters:',
    Object.entries(values).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  const { rows: tossups } = await client.query<Tossup>(query, values);
  return tossups.map(transformTossup);
};
