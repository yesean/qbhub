export const ROUTES = {
  reader: {
    root: '/tossup',
    tossup: '/tossup',
    bonus: '/bonus',
  },
  freq: {
    root: '/frequency',
  },
  clues: {
    search: '/clue',
    searchResults: (answer: string) => `/clue/search/${answer}`,
    display: (answer: string) => `/clue/display/${answer}`,
  },
  about: {
    root: '/about',
  },
};
