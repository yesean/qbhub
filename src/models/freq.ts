import { QuestionFilters } from '../types/questions';
import { client, QueryBuilder, getQuestionCondition } from '../utils/db';

const columns = [
  { column: 'normalized_answer', alias: 'answer' },
  { column: 'count(normalized_answer)', alias: 'frequency' },
];
const columnOrder: { column: string; direction: 'asc' | 'desc' }[] = [
  { column: 'count(normalized_answer)', direction: 'desc' },
  { column: 'normalized_answer', direction: 'asc' },
];

export const getFreq = (questionFilters: QuestionFilters) => {
  const condition = getQuestionCondition(questionFilters, {
    useNormalizedAnswer: true,
  });
  const query = QueryBuilder.start()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tossups.tournament_id = tournaments.id')
    .where(condition)
    .groupBy('normalized_answer')
    .orderBy(columnOrder)
    .limit(questionFilters.limit)
    .offset(questionFilters.offset)
    .build();

  return client.query(query);
};
