import { Category, Difficulty, Subcategory, Tournament } from '@qbhub/types';
import queryString from 'query-string';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DecodedValueMap,
  QueryParamConfigMap,
  encodeQueryParams,
  useQueryParams,
} from 'use-query-params';
import {
  NeverNullStringParam,
  buildNeverNullRangedNumberParamWithSkip,
  buildNumericEnumArrayParam,
} from './queryParams';
import { MAX_TOURNAMENT_YEAR, MIN_TOURNAMENT_YEAR } from './settings/constants';

const FromYearParam = buildNeverNullRangedNumberParamWithSkip(
  MIN_TOURNAMENT_YEAR,
  MAX_TOURNAMENT_YEAR,
  MIN_TOURNAMENT_YEAR,
);

const GLOBAL_QUERY_PARAMS = {
  categories: buildNumericEnumArrayParam(Category),
  difficulties: buildNumericEnumArrayParam(Difficulty),
  fromYear: FromYearParam,
  subcategories: buildNumericEnumArrayParam(Subcategory),
  tournaments: buildNumericEnumArrayParam(Tournament),
};

function buildRoute<T extends QueryParamConfigMap>(
  path: string,
  extraQueryParams: T = {} as T,
) {
  return {
    path,
    queryParams: { ...GLOBAL_QUERY_PARAMS, ...extraQueryParams },
  };
}

const ROUTES = {
  about: buildRoute('/about'),
  bonusReader: buildRoute('/bonus'),
  clue: {
    display: buildRoute('/clue/display', {
      answer: NeverNullStringParam,
      query: NeverNullStringParam,
    }),
    search: buildRoute('/clue', { query: NeverNullStringParam }),
  },
  frequencyList: buildRoute('/frequency'),
  tossupReader: buildRoute('/tossup'),
};

type RouteConfig<T extends QueryParamConfigMap> = {
  path: string;
  queryParams: T;
};

function buildGetURL<T extends QueryParamConfigMap>({
  path,
  queryParams,
}: RouteConfig<T>) {
  return function getURL(query?: Partial<DecodedValueMap<T>>) {
    if (query === undefined) return path;

    const encodedQuery = encodeQueryParams(queryParams, query);
    return `${path}?${queryString.stringify(encodedQuery)}`;
  };
}

export type RouteURL = {
  go: () => void;
  href: string;
};

export function isRouteURL(url: RouteURL | string): url is RouteURL {
  return (url as RouteURL).href !== undefined;
}

function buildUseRouteContext<T extends QueryParamConfigMap>(
  routeConfig: RouteConfig<T>,
) {
  return function useRouteContext() {
    const [params] = useQueryParams<T>(routeConfig.queryParams);
    const navigate = useNavigate();

    const getURL = useCallback(
      (newParams: Partial<DecodedValueMap<T>>) => {
        const url = buildGetURL(routeConfig)({ ...params, ...newParams });
        return {
          go() {
            navigate(url);
          },
          href: url,
        } as RouteURL;
      },
      [navigate, params],
    );

    return useMemo(
      () => ({
        getURL,
        params,
      }),
      [getURL, params],
    );
  };
}

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

export function useGlobalQueryParams() {
  return useQueryParams(GLOBAL_QUERY_PARAMS);
}

export function useGetURL() {
  const [params] = useGlobalQueryParams();

  return useMemo(
    () => ({
      getAboutURL: (newParams: Parameters<typeof getAboutURL>[0] = {}) =>
        getAboutURL({ ...params, ...newParams }),
      getBonusReaderURL: (
        newParams: Parameters<typeof getBonusReaderURL>[0] = {},
      ) => getBonusReaderURL({ ...params, ...newParams }),
      getClueDisplayURL: (
        newParams: Parameters<typeof getClueDisplayURL>[0] = {},
      ) => getClueDisplayURL({ ...params, ...newParams }),
      getClueSearchURL: (
        newParams: Parameters<typeof getClueSearchURL>[0] = {},
      ) => getClueSearchURL({ ...params, ...newParams }),
      getFrequencyListURL: (
        newParams: Parameters<typeof getFrequencyListURL>[0] = {},
      ) => getFrequencyListURL({ ...params, ...newParams }),
      getTossupReaderURL: (
        newParams: Parameters<typeof getTossupReaderURL>[0] = {},
      ) => getTossupReaderURL({ ...params, ...newParams }),
    }),
    [params],
  );
}

export function usePage() {
  const { pathname } = useLocation();

  const isTossupReader = pathname.startsWith(ROUTES.tossupReader.path);
  const isBonusReader = pathname.startsWith(ROUTES.bonusReader.path);
  return useMemo(
    () => ({
      isAbout: pathname.startsWith(ROUTES.about.path),
      isBonusReader,
      isClueDisplay: pathname.startsWith(ROUTES.clue.display.path),
      isClueSearch: pathname.startsWith(ROUTES.clue.search.path),
      isFrequencyList: pathname.startsWith(ROUTES.frequencyList.path),
      isReader: isTossupReader || isBonusReader,
      isTossupReader,
    }),
    [isBonusReader, isTossupReader, pathname],
  );
}
