import { BonusPart, BonusParts, QuestionFilters } from '../types/controller';
import { Bonus as DBBonus, BonusPart as DBBonusPart, Order } from '../types/db';
import { TABLES } from '../utils/constants';
import { client, QueryBuilder } from '../utils/db';
import logger from '../utils/logger';
import { transformBonus, transformBonusPart } from '../utils/model';

const bonusesColumns = [
  { name: TABLES.bonuses.columns.id },
  { name: TABLES.bonuses.columns.leadin },
  { name: TABLES.bonuses.columns.formattedLeadin },
  { name: TABLES.bonuses.columns.category, alias: 'category' },
  { name: TABLES.bonuses.columns.subcategory, alias: 'subcategory' },
  { name: TABLES.tournaments.columns.difficulty },
  { name: TABLES.tournaments.columns.name, alias: 'tournament' },
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

const bonusPartsColumnOrder: Order = [
  { name: TABLES.bonusParts.columns.bonusId, direction: 'asc' },
  { name: TABLES.bonusParts.columns.number, direction: 'asc' },
];

export const getBonuses = async (questionFilters: QuestionFilters) => {
  const [bonusesQuery, bonusesValues] = new QueryBuilder()
    .select(bonusesColumns)
    .from(TABLES.bonuses.name)
    .innerJoin(
      TABLES.tournaments.name,
      TABLES.bonuses.columns.tournament,
      TABLES.tournaments.columns.id,
    )
    .filterBonuses(questionFilters)
    .random()
    .limit(questionFilters.limit)
    .build();

  logger.info(`Bonuses SQL Query:\n${bonusesQuery}`);
  logger.info(
    'Parameters:',
    Object.entries(bonusesValues).map((e) => [Number(e[0]) + 1, e[1]]),
  );

  const { rows: bonuses } = await client.query<DBBonus>(
    bonusesQuery,
    bonusesValues,
  );
  const bonusIds = bonuses.map(({ id }) => id);

  const [bonusPartsQuery, bonusPartsValues] = new QueryBuilder()
    .select(bonusPartsColumns)
    .from(TABLES.bonusParts.name)
    .filterBonusParts(bonusIds)
    .orderBy(bonusPartsColumnOrder)
    .build();

  logger.info(`Bonus parts SQL Query:\n${bonusPartsQuery}`);
  logger.info(
    'Parameters:',
    Object.entries(bonusPartsValues).map((e) => [Number(e[0]) + 1, e[1]]),
  );
  const { rows: bonusParts } = await client.query<DBBonusPart>(
    bonusPartsQuery,
    bonusPartsValues,
  );

  const bonusPartsMap = bonusParts.reduce<Map<number, BonusPart[]>>(
    (acc, bonusPart) => {
      const { bonus_id: bonusId } = bonusPart;
      if (acc.has(bonusId)) {
        acc.get(bonusId).push(transformBonusPart(bonusPart));
      } else {
        acc.set(bonusId, [transformBonusPart(bonusPart)]);
      }
      return acc;
    },
    new Map(),
  );

  const transformedBonuses = bonuses.map((bonus) =>
    transformBonus(bonus, bonusPartsMap.get(bonus.id) as BonusParts),
  );

  return transformedBonuses;
};
