export const ROUTES = {
  reader: {
    root: '/reader',
    tossup: '/reader/tossup',
    bonus: '/reader/bonus',
  },
  freq: {
    root: '/freq',
  },
  clues: {
    root: '/clues',
    search: '/clues/search',
    searchResults: (answer: string) => `/clues/search/${answer}`,
    display: (answer: string) => `/clues/display/${answer}`,
  },
  about: {
    root: '/about',
  },
};
