export const ROUTES = {
  tossupReader: '/reader/tossup',
  bonusReader: '/reader/bonuses',
  freq: '/freq',
  cluesRoot: '/clues',
  cluesSearch: '/clues/search',
  cluesSearchResults: (answer: string) => `/clues/search/${answer}`,
  cluesDisplay: (answer: string) => `/clues/display/${answer}`,
};
