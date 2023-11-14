import { Category, Difficulty, Subcategory, Tournament } from '@qbhub/types';
import queryString from 'query-string';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DecodedValueMap,
  encodeQueryParams,
  QueryParamConfigMap,
  useQueryParams,
} from 'use-query-params';
import {
  buildNumericEnumArrayParam,
  NeverNullNumberParam,
  NeverNullStringParam,
} from './queryParams';

const GLOBAL_QUERY_PARAMS = {
  categories: buildNumericEnumArrayParam(Category),
  subcategories: buildNumericEnumArrayParam(Subcategory),
  difficulties: buildNumericEnumArrayParam(Difficulty),
  tournaments: buildNumericEnumArrayParam(Tournament),
  fromYear: NeverNullNumberParam,
  readingSpeed: NeverNullNumberParam,
};

const buildRoute = <T extends QueryParamConfigMap>(
  path: string,
  extraQueryParams: T = {} as T,
) => ({
  path,
  queryParams: { ...GLOBAL_QUERY_PARAMS, ...extraQueryParams },
});

const ROUTES = {
  tossupReader: buildRoute('/tossup'),
  bonusReader: buildRoute('/bonus'),
  frequencyList: buildRoute('/frequency'),
  clue: {
    search: buildRoute('/clue', { query: NeverNullStringParam }),
    display: buildRoute('/clue/display', {
      answer: NeverNullStringParam,
    }),
  },
  about: buildRoute('/about'),
};

type RouteConfig<T extends QueryParamConfigMap> = {
  path: string;
  queryParams: T;
};

const buildGetURL =
  <T extends QueryParamConfigMap>({ path, queryParams }: RouteConfig<T>) =>
  (query?: Partial<DecodedValueMap<T>>) => {
    if (query == null) return path;

    const encodedQuery = encodeQueryParams(queryParams, query);
    return `${path}?${queryString.stringify(encodedQuery)}`;
  };

const buildUseRouteContext = <T extends QueryParamConfigMap>(
  routeConfig: RouteConfig<T>,
) =>
  function useRouteContext() {
    const [params] = useQueryParams<T>(routeConfig.queryParams);

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

export const getTossupReaderURL = buildGetURL(ROUTES.tossupReader);
export const getBonusReaderURL = buildGetURL(ROUTES.bonusReader);
export const getFrequencyListURL = buildGetURL(ROUTES.frequencyList);
export const getClueSearchURL = buildGetURL(ROUTES.clue.search);
export const getClueDisplayURL = buildGetURL(ROUTES.clue.display);
export const getAboutURL = buildGetURL(ROUTES.about);

export const useTossupReaderRouteContext = buildUseRouteContext(
  ROUTES.tossupReader,
);
export const useBonusReaderRouteContext = buildUseRouteContext(
  ROUTES.bonusReader,
);
export const useFrequencyListRouteContext = buildUseRouteContext(
  ROUTES.frequencyList,
);
export const useClueSearchRouteContext = buildUseRouteContext(
  ROUTES.clue.search,
);
export const useClueDisplayRouteContext = buildUseRouteContext(
  ROUTES.clue.display,
);
export const useAboutRouteContext = buildUseRouteContext(ROUTES.about);

export const useGlobalQueryParams = () => useQueryParams(GLOBAL_QUERY_PARAMS);

export const useGetURL = () => {
  const [params] = useGlobalQueryParams();

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

export const usePage = () => {
  const { pathname } = useLocation();

  const isTossupReader = pathname.startsWith(ROUTES.tossupReader.path);
  const isBonusReader = pathname.startsWith(ROUTES.bonusReader.path);
  return useMemo(
    () => ({
      isTossupReader,
      isBonusReader,
      isReader: isTossupReader || isBonusReader,
      isFrequencyList: pathname.startsWith(ROUTES.frequencyList.path),
      isClueSearch: pathname.startsWith(ROUTES.clue.search.path),
      isClueDisplay: pathname.startsWith(ROUTES.clue.display.path),
      isAbout: pathname.startsWith(ROUTES.about.path),
    }),
    [isBonusReader, isTossupReader, pathname],
  );
};
