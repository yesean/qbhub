import { QuestionFilters } from '../types/questions';
import { client, getQuestionCondition, QueryBuilder } from '../utils/db';

const columns = [
  { column: 'text', alias: 'text' },
  { column: 'answer', alias: 'answer' },
  { column: 'formatted_text', alias: 'formatted_text' },
  { column: 'formatted_answer', alias: 'formatted_answer' },
  { column: 'normalized_answer', alias: 'normalized_answer' },
  { column: 'category_id', alias: 'category' },
  { column: 'subcategory_id', alias: 'subcategory' },
  { column: 'difficulty', alias: 'difficulty' },
  { column: 'name', alias: 'tournament' },
  { column: 'year', alias: 'year' },
];

export const getTossups = (questionFilters: QuestionFilters) => {
  const condition = getQuestionCondition(questionFilters);
  const query = QueryBuilder.start()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tossups.tournament_id = tournaments.id')
    .where(condition)
    .random()
    .limit(questionFilters.limit)
    .build();

  return client.query(query);
};
