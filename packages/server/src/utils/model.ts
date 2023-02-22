import { Bonus, BonusPart, Tossup } from '@qbhub/types';
import {
  Bonus as DBBonus,
  BonusPart as DBBonusPart,
  Tossup as DBTossup,
} from '../types/db';

export const transformTossup = (tossup: DBTossup): Tossup => ({
  id: tossup.id,
  text: tossup.text,
  formattedText: tossup.formatted_text,
  answer: tossup.answer,
  formattedAnswer: tossup.formatted_answer,
  normalizedAnswer: tossup.normalized_answer,
  category: tossup.category,
  ...(tossup.subcategory ? { subcategory: tossup.subcategory } : {}),
  difficulty: tossup.difficulty,
  tournament: tossup.tournament,
  year: tossup.year,
});

export const transformBonus = (bonus: DBBonus, parts: BonusPart[]): Bonus => ({
  id: bonus.id,
  leadin: bonus.leadin,
  formattedLeadin: bonus.formatted_leadin,
  category: bonus.category,
  ...(bonus.subcategory ? { subcategory: bonus.subcategory } : {}),
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
