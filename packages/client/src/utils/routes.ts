import queryString from 'query-string';
import { useCallback, useMemo } from 'react';
import {
  DecodedValueMap,
  DelimitedNumericArrayParam,
  encodeQueryParams,
  NumberParam,
  QueryParamConfigMap,
  StringParam,
  useQueryParams,
} from 'use-query-params';

const SETTINGS_SEARCH_PARAMS = {
  categories: DelimitedNumericArrayParam,
  subcategories: DelimitedNumericArrayParam,
  difficulties: DelimitedNumericArrayParam,
  tournaments: DelimitedNumericArrayParam,
  fromYear: NumberParam,
};

const ROUTES = {
  tossupReader: {
    path: '/tossup',
    searchParams: SETTINGS_SEARCH_PARAMS,
  },
  bonusReader: {
    path: '/bonus',
    searchParams: SETTINGS_SEARCH_PARAMS,
  },
  frequencyList: {
    path: '/frequency',
    searchParams: SETTINGS_SEARCH_PARAMS,
  },
  clue: {
    search: {
      path: '/clue',
      searchParams: {
        ...SETTINGS_SEARCH_PARAMS,
        query: StringParam,
      },
    },
    display: {
      path: '/clue/display',
      searchParams: {
        ...SETTINGS_SEARCH_PARAMS,
        answer: StringParam,
      },
    },
  },
  about: {
    path: '/about',
    searchParams: SETTINGS_SEARCH_PARAMS,
  },
};

export const isInTossupReader = (path: string) =>
  path.startsWith(ROUTES.tossupReader.path);
export const isInBonusReader = (path: string) =>
  path.startsWith(ROUTES.bonusReader.path);
export const isInFrequencyList = (path: string) =>
  path.startsWith(ROUTES.frequencyList.path);
export const isInClueSearch = (path: string) =>
  path.startsWith(ROUTES.clue.search.path);
export const isInClueDisplay = (path: string) =>
  path.startsWith(ROUTES.clue.display.path);
export const isInAbout = (path: string) => path.startsWith(ROUTES.about.path);
export const isInReader = (path: string) =>
  isInTossupReader(path) || isInBonusReader(path);

type RouteConfig<T extends QueryParamConfigMap> = {
  path: string;
  searchParams: T;
};

const buildGetURL =
  <T extends QueryParamConfigMap>({ path, searchParams }: RouteConfig<T>) =>
  (query?: Partial<DecodedValueMap<T>>) => {
    if (query == null) return path;

    const encodedQuery = encodeQueryParams(searchParams, query);
    return `${path}?${queryString.stringify(encodedQuery)}`;
  };

const buildUseRouteContext = <T extends QueryParamConfigMap>(
  routeConfig: RouteConfig<T>,
) =>
  function useRouteContext() {
    const [params] = useQueryParams<T>(routeConfig.searchParams);

    const getURL = useCallback(
      (newParams: Partial<DecodedValueMap<T>>) =>
        buildGetURL(routeConfig)({ ...params, ...newParams }),
      [params],
    );

    return useMemo(
      () => ({
        params,
        getURL,
      }),
      [getURL, params],
    );
  };

export const useRouteContext = buildUseRouteContext({
  path: '/',
  searchParams: SETTINGS_SEARCH_PARAMS,
});

export const getTossupReaderURL = buildGetURL(ROUTES.tossupReader);
export const useTossupReaderRouteContext = buildUseRouteContext(
  ROUTES.tossupReader,
);

export const getBonusReaderURL = buildGetURL(ROUTES.bonusReader);
export const useBonusReaderRouteContext = buildUseRouteContext(
  ROUTES.bonusReader,
);

export const getFrequencyListURL = buildGetURL(ROUTES.frequencyList);
export const useFrequencyListRouteContext = buildUseRouteContext(
  ROUTES.frequencyList,
);

export const getClueSearchURL = buildGetURL(ROUTES.clue.search);
export const useClueSearchRouteContext = buildUseRouteContext(
  ROUTES.clue.search,
);

export const getClueDisplayURL = buildGetURL(ROUTES.clue.display);
export const useClueDisplayRouteContext = buildUseRouteContext(
  ROUTES.clue.display,
);

export const getAboutURL = buildGetURL(ROUTES.about);
export const useAboutRouteContext = buildUseRouteContext(ROUTES.about);

export const useGetURL = () => {
  const { params } = useRouteContext();

  return useMemo(
    () => ({
      getTossupReaderURL: (
        newParams: Parameters<typeof getTossupReaderURL>[0] = {},
      ) => getTossupReaderURL({ ...params, ...newParams }),
      getBonusReaderURL: (
        newParams: Parameters<typeof getBonusReaderURL>[0] = {},
      ) => getBonusReaderURL({ ...params, ...newParams }),
      getFrequencyListURL: (
        newParams: Parameters<typeof getFrequencyListURL>[0] = {},
      ) => getFrequencyListURL({ ...params, ...newParams }),
      getClueSearchURL: (
        newParams: Parameters<typeof getClueSearchURL>[0] = {},
      ) => getClueSearchURL({ ...params, ...newParams }),
      getClueDisplayURL: (
        newParams: Parameters<typeof getClueDisplayURL>[0] = {},
      ) => getClueDisplayURL({ ...params, ...newParams }),
      getAboutURL: (newParams: Parameters<typeof getAboutURL>[0] = {}) =>
        getAboutURL({ ...params, ...newParams }),
    }),
    [params],
  );
};
