import { Category, Difficulty, Subcategory } from '../types/questions';
import { client, QueryBuilder } from '../utils/db';
import { getTossupCondition } from './utils';

export const getClues = async (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  answer: string,
) => {
  const columns = [
    { column: 'name', alias: 'tournament' },
    { column: 'text', alias: 'text' },
    { column: 'normalized_answer', alias: 'answer' },
  ];
  const tossup = {
    categories,
    subcategories,
    difficulties,
    text: '',
    answer,
  };
  const condition = getTossupCondition(tossup, { useNormalized: true });
  const query = QueryBuilder.start()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tossups.tournament_id = tournaments.id')
    .where(condition)
    .build();

  return client.query(query);
};
