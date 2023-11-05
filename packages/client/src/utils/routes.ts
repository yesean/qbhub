import { useSearchParams } from 'react-router-dom';

export const ROUTES = {
  tossupReader: '/tossup',
  bonusReader: '/bonus',
  frequencyList: '/frequency',
  about: '/about',
  clue: {
    search: '/clue',
    display: '/clue/display',
  },
};

const settingsSearchParamKeys = [
  'categories',
  'subcategories',
  'difficulties',
  'tournaments',
];

// concatenate URL with URLSearchParams
const buildURL = (url: string, searchParams: URLSearchParams) =>
  `${url}?${searchParams.toString()}`;

// build new URLSearchParams with specified param keys
const filterSearchParams = (searchParams: URLSearchParams, keys: string[]) => {
  const entries = [...searchParams.entries()];
  const filteredEntries = entries.filter(([key]) => keys.includes(key));
  return new URLSearchParams(filteredEntries);
};

// build new URLSearchParams with new params in a more convenient object form
const mergeSearchParams = (
  searchParams: URLSearchParams,
  newSearchParams: { [key: string]: any },
) => {
  const searchParamEntries = [...searchParams.entries()];
  const newSearchParamEntries = Object.entries(newSearchParams);

  return new URLSearchParams([...searchParamEntries, ...newSearchParamEntries]);
};

export const useGetClueSearchURL = () => {
  const [searchParams] = useSearchParams();
  const settingsSearchParams = filterSearchParams(
    searchParams,
    settingsSearchParamKeys,
  );

  return (query: string) => {
    const newSearchParams = mergeSearchParams(settingsSearchParams, { query });
    return buildURL(ROUTES.clue.search, newSearchParams);
  };
};

export const useGetClueDisplayURL = () => {
  const [searchParams] = useSearchParams();
  const settingsSearchParams = filterSearchParams(
    searchParams,
    settingsSearchParamKeys,
  );

  return (answer: string) => {
    const newSearchParams = mergeSearchParams(settingsSearchParams, { answer });
    return buildURL(ROUTES.clue.display, newSearchParams);
  };
};
