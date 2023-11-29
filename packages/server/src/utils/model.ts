import { Bonus, BonusPart, Tossup } from '@qbhub/types';
import {
  Bonus as DBBonus,
  BonusPart as DBBonusPart,
  Tossup as DBTossup,
} from '../types/db.js';

export const transformTossup = (tossup: DBTossup): Tossup => ({
  answer: tossup.answer,
  category: tossup.category,
  formattedAnswer: tossup.formatted_answer,
  formattedText: tossup.formatted_text,
  id: tossup.id,
  normalizedAnswer: tossup.normalized_answer,
  text: tossup.text,
  ...(tossup.subcategory ? { subcategory: tossup.subcategory } : {}),
  difficulty: tossup.difficulty,
  tournament: tossup.tournament,
  year: tossup.year,
});

export const transformBonus = (bonus: DBBonus, parts: BonusPart[]): Bonus => ({
  category: bonus.category,
  formattedLeadin: bonus.formatted_leadin,
  id: bonus.id,
  leadin: bonus.leadin,
  ...(bonus.subcategory ? { subcategory: bonus.subcategory } : {}),
  difficulty: bonus.difficulty,
  parts,
  tournament: bonus.tournament,
  year: bonus.year,
});

export const transformBonusPart = (bonusPart: DBBonusPart): BonusPart => ({
  answer: bonusPart.answer,
  formattedAnswer: bonusPart.formatted_answer,
  formattedText: bonusPart.formatted_text,
  number: bonusPart.number,
  text: bonusPart.text,
});
