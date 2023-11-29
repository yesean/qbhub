import { BonusPart, QuestionParameters, SortOption } from '@qbhub/types';
import { log } from '@qbhub/utils';
import {
  Bonus as DBBonus,
  BonusPart as DBBonusPart,
  Order,
} from '../types/db.js';
import { TABLES } from '../utils/constants.js';
import { QueryBuilder, client } from '../utils/db.js';
import { transformBonus, transformBonusPart } from '../utils/model.js';

const bonusesColumns = [
  { name: TABLES.bonuses.columns.id },
  { name: TABLES.bonuses.columns.leadin },
  { name: TABLES.bonuses.columns.formattedLeadin },
  { name: TABLES.bonuses.columns.category, alias: 'category' },
  { name: TABLES.bonuses.columns.subcategory, alias: 'subcategory' },
  { name: TABLES.tournaments.columns.difficulty },
  { name: TABLES.tournaments.columns.id, alias: 'tournament' },
  { name: TABLES.tournaments.columns.year },
];

const bonusPartsColumns = [
  { name: TABLES.bonusParts.columns.bonusId },
  { name: TABLES.bonusParts.columns.text },
  { name: TABLES.bonusParts.columns.answer },
  { name: TABLES.bonusParts.columns.formattedText },
  { name: TABLES.bonusParts.columns.formattedAnswer },
  { name: TABLES.bonusParts.columns.number },
];

const bonusPartsOrder: Order = [
  { name: TABLES.bonusParts.columns.bonusId, direction: 'asc' },
  { name: TABLES.bonusParts.columns.number, direction: 'asc' },
];

/**
 * Retrieves and formats bonuses from the database.
 * Bonus retrieval is a two-step process:
 *  1. Retrieve the bonuses from the `bonuses` table. (only metadata)
 *  2. Retrieve all of the bonusParts from the `bonus_parts` table (actual content) that match the bonuses from step 1.
 */
export const getBonuses = async (questionFilters: QuestionParameters) => {
  const bonusesOrder: Order = [
    {
      name: TABLES.tournaments.columns.year,
      direction: questionFilters.sort === SortOption.latest ? 'desc' : 'asc',
    },
  ];

  // query bonuses
  const partialQuery = new QueryBuilder()
    .select(bonusesColumns)
    .from(TABLES.bonuses.name)
    .innerJoin(
      TABLES.tournaments.name,
      TABLES.bonuses.columns.tournament,
      TABLES.tournaments.columns.id,
    )
    .filterBonuses(questionFilters);
  if (questionFilters.sort === SortOption.random) {
    partialQuery.random();
  } else {
    partialQuery.orderBy(bonusesOrder);
  }
  const [bonusesQuery, bonusesValues] = partialQuery
    .limit(questionFilters.limit)
    .build();

  log.debug(`Bonuses SQL Query:\n${bonusesQuery}`);
  log.debug(
    'Parameters:',
    Object.entries(bonusesValues).map((e) => [Number(e[0]) + 1, e[1]]),
  );

  const { rows: bonuses } = await client.query<DBBonus>(
    bonusesQuery,
    bonusesValues,
  );
  const bonusIds = bonuses.map(({ id }) => id);

  // if no bonuses are found, stop
  if (bonusIds.length === 0) return [];

  // query bonus_parts
  const [bonusPartsQuery, bonusPartsValues] = new QueryBuilder()
    .select(bonusPartsColumns)
    .from(TABLES.bonusParts.name)
    .filterBonusParts(bonusIds)
    .orderBy(bonusPartsOrder)
    .build();

  log.debug(`Bonus parts SQL Query:\n${bonusPartsQuery}`);
  log.debug(
    'Parameters:',
    Object.entries(bonusPartsValues).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  const { rows: bonusParts } = await client.query<DBBonusPart>(
    bonusPartsQuery,
    bonusPartsValues,
  );

  // map bonus_id to BonusParts
  const bonusPartsMap = bonusParts.reduce<Map<number, BonusPart[]>>(
    (acc, bonusPart) => {
      const { bonus_id: bonusId } = bonusPart;
      if (acc.has(bonusId)) {
        acc.get(bonusId)!.push(transformBonusPart(bonusPart));
      } else {
        acc.set(bonusId, [transformBonusPart(bonusPart)]);
      }
      return acc;
    },
    new Map(),
  );

  // combine bonuses with bonus parts
  const transformedBonuses = bonuses.map((bonus) =>
    transformBonus(bonus, bonusPartsMap.get(bonus.id) as BonusPart[]),
  );

  return transformedBonuses;
};
