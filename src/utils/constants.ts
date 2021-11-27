export const TABLES = {
  tossups: {
    name: 'tossups',
    columns: {
      id: 'tossups.id',
      text: 'tossups.text',
      answer: 'tossups.answer',
      formattedText: 'tossups.formatted_text',
      formattedAnswer: 'tossups.formatted_answer',
      normalizedAnswer: 'tossups.normalized_answer',
      category: 'tossups.category_id',
      subcategory: 'tossups.subcategory_id',
      tournament: 'tossups.tournament_id',
    },
  },
  bonuses: {
    name: 'bonuses',
    columns: {
      id: 'bonuses.id',
      leadin: 'bonuses.leadin',
      formattedLeadin: 'bonuses.formatted_leadin',
      category: 'bonuses.category_id',
      subcategory: 'bonuses.subcategory_id',
      difficulty: 'bonuses.difficulty',
      tournament: 'bonuses.tournament_id',
    },
  },
  bonusParts: {
    name: 'bonus_parts',
    columns: {
      id: 'bonus_parts.id',
      bonusId: 'bonus_parts.bonus_id',
      text: 'bonus_parts.text',
      answer: 'bonus_parts.answer',
      formattedText: 'bonus_parts.formatted_text',
      formattedAnswer: 'bonus_parts.formatted_answer',
      number: 'bonus_parts.number',
    },
  },
  tournaments: {
    name: 'tournaments',
    columns: {
      id: 'tournaments.id',
      year: 'tournaments.year',
      name: 'tournaments.name',
      difficulty: 'tournaments.difficulty',
    },
  },
  categories: {
    name: 'categories',
    columns: {
      id: 'categories.id',
    },
  },
  subcategories: {
    name: 'subcategories',
    columns: {
      id: 'subcategories.id',
    },
  },
};

export const MIN_TOURNAMENT_YEAR = 2005;
export const MAX_TOURNAMENT_YEAR = 2020;
