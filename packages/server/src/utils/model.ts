import { Bonus, BonusPart, BonusParts, Tossup } from '../types/controller';
import {
  Bonus as DBBonus,
  BonusPart as DBBonusPart,
  Tossup as DBTossup,
} from '../types/db';

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

export const transformBonus = (bonus: DBBonus, parts: BonusParts): Bonus => ({
  id: bonus.id,
  leadin: bonus.leadin,
  formattedLeadin: bonus.formatted_leadin,
  category: bonus.category,
  subcategory: bonus.subcategory,
  difficulty: bonus.difficulty,
  tournament: bonus.tournament,
  year: bonus.year,
  parts,
});

export const transformBonusPart = (bonusPart: DBBonusPart): BonusPart => ({
  text: bonusPart.text,
  answer: bonusPart.answer,
  formattedText: bonusPart.formatted_text,
  formattedAnswer: bonusPart.formatted_answer,
  number: bonusPart.number,
});
