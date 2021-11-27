export const TABLES = {
  tossups: {
    name: 'tossups',
    columns: {
      id: 'tossups.id',
      text: 'tossups.text',
      formattedText: 'tossups.formatted_text',
      answer: 'tossups.answer',
      formattedAnswer: 'tossups.formatted_answer',
      normalizedAnswer: 'tossups.normalized_answer',
      tournament: 'tossups.tournament_id',
      category: 'tossups.category_id',
      subcategory: 'tossups.subcategory_id',
    },
  },
  bonuses: {
    name: 'bonuses',
    columns: {
      id: 'bonuses.id',
      tournament: 'bonuses.tournament_id',
      category: 'bonuses.category_id',
      difficulty: 'bonuses.difficulty',
      leading: 'bonuses.leadin',
      formattedLeadin: 'bonuses.formatted_leadin',
    },
  },
  bonusParts: {
    name: 'bonus_parts',
    columns: {
      id: 'bonus_parts.id',
      bonus: 'bonus_parts.bonus_id',
      text: 'bonus_parts.text',
      formattedText: 'bonus_parts.formatted_text',
      answer: 'bonus_parts.answer',
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
