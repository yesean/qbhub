import { Bonus, BonusPart, Tossup } from '@qbhub/types';
import { cleanTossupText, QBString } from '@qbhub/utils';

import {
  Bonus as DBBonus,
  BonusPart as DBBonusPart,
  Tossup as DBTossup,
} from '../types/db.js';

export const transformTossup = ({
  subcategory,
  ...restOfTossup
}: DBTossup): Tossup => ({
  ...restOfTossup,
  ...(subcategory ? { subcategory } : {}),
  formattedAnswer: QBString.normalizeTags(restOfTossup.formatted_answer),
  formattedText: cleanTossupText(restOfTossup.formatted_text),
  normalizedAnswer: restOfTossup.normalized_answer,
  text: cleanTossupText(restOfTossup.text),
});

export const transformBonus = (
  { subcategory, ...restOfBonus }: DBBonus,
  parts: BonusPart[],
): Bonus => ({
  ...restOfBonus,
  ...(subcategory ? { subcategory } : {}),
  formattedLeadin: QBString.normalizeTags(restOfBonus.formatted_leadin),
  parts,
});

export const transformBonusPart = (bonusPart: DBBonusPart): BonusPart => ({
  ...bonusPart,
  formattedAnswer: QBString.normalizeTags(bonusPart.formatted_answer),
  formattedText: QBString.normalizeTags(bonusPart.formatted_text),
});
