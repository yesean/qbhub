import { Tossup } from '../types/controller';
import { Tossup as DBTossup } from '../types/db';

export const transformTossup = (tossup: DBTossup): Tossup => ({
  text: tossup.text,
  formattedText: tossup.formatted_text,
  answer: tossup.answer,
  formattedAnswer: tossup.formatted_answer,
  normalizedAnswer: tossup.normalized_answer,
  category: tossup.category,
  subcategory: tossup.subcategory,
  difficulty: tossup.difficulty,
  tournament: tossup.tournament,
  year: tossup.year,
});
