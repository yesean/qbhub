export const TABLES = {
  bonuses: {
    columns: {
      category: 'bonuses.category_id',
      difficulty: 'bonuses.difficulty',
      formattedLeadin: 'bonuses.formatted_leadin',
      id: 'bonuses.id',
      leadin: 'bonuses.leadin',
      subcategory: 'bonuses.subcategory_id',
      tournament: 'bonuses.tournament_id',
    },
    name: 'bonuses',
  },
  bonusParts: {
    columns: {
      answer: 'bonus_parts.answer',
      bonusId: 'bonus_parts.bonus_id',
      formattedAnswer: 'bonus_parts.formatted_answer',
      formattedText: 'bonus_parts.formatted_text',
      id: 'bonus_parts.id',
      number: 'bonus_parts.number',
      text: 'bonus_parts.text',
    },
    name: 'bonus_parts',
  },
  categories: {
    columns: {
      id: 'categories.id',
    },
    name: 'categories',
  },
  subcategories: {
    columns: {
      id: 'subcategories.id',
    },
    name: 'subcategories',
  },
  tossups: {
    columns: {
      answer: 'tossups.answer',
      category: 'tossups.category_id',
      formattedAnswer: 'tossups.formatted_answer',
      formattedText: 'tossups.formatted_text',
      id: 'tossups.id',
      normalizedAnswer: 'tossups.normalized_answer',
      subcategory: 'tossups.subcategory_id',
      text: 'tossups.text',
      tournament: 'tossups.tournament_id',
    },
    name: 'tossups',
  },
  tournaments: {
    columns: {
      difficulty: 'tournaments.difficulty',
      id: 'tournaments.id',
      name: 'tournaments.name',
      year: 'tournaments.year',
    },
    name: 'tournaments',
  },
};

export const MIN_TOURNAMENT_YEAR = 2005;
export const MAX_TOURNAMENT_YEAR = 2020;

export const DEFAULT_LIMIT = 10;
export const MIN_LIMIT = 0;
export const MAX_LIMIT = 200;
