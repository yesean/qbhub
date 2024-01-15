import {
  Category,
  Difficulty,
  PartialOptional,
  Subcategory,
  Tournament,
} from '@qbhub/types';
import { QueryParamConfigMap, useQueryParams } from 'use-query-params';
import {
  NeverNullOrUndefinedStringParam,
  NeverNullStringParam,
  buildNeverNullRangedNumberParamWithSkip,
  buildNumericEnumArrayParam,
} from './utils/queryParams';
import { Route, RouteConfig, buildUseRouteContext } from './utils/routes';
import {
  MAX_TOURNAMENT_YEAR,
  MIN_TOURNAMENT_YEAR,
} from './utils/settings/constants';

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

export type GlobalQueryParams = typeof GLOBAL_QUERY_PARAMS;

export function useGlobalQueryParams() {
  return useQueryParams(GLOBAL_QUERY_PARAMS);
}

type InputRouteConfig<T extends QueryParamConfigMap> = PartialOptional<
  RouteConfig<T>,
  'queryParams'
>;

export function buildRoute<T extends QueryParamConfigMap>({
  path,
  queryParams = {} as T,
}: InputRouteConfig<T>): Route<T> {
  const combinedQueryParams = { ...GLOBAL_QUERY_PARAMS, ...queryParams };
  const useRouteContext = buildUseRouteContext({
    path,
    queryParams: combinedQueryParams,
  });

  return {
    path,
    queryParams: combinedQueryParams,
    useRouteContext,
  };
}

export const ROUTES = {
  about: buildRoute({ path: '/about' }),
  bonusReader: buildRoute({ path: '/bonus' }),
  clueDisplay: buildRoute({
    path: '/clue/display',
    queryParams: {
      answer: NeverNullStringParam,
      query: NeverNullStringParam,
    },
  }),
  clueSearch: buildRoute({
    path: '/clue',
    queryParams: {
      query: NeverNullOrUndefinedStringParam,
    },
  }),
  frequencyList: buildRoute({ path: '/frequency' }),
  tossupReader: buildRoute({ path: '/tossup' }),
} as const;
