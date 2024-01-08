import queryString from 'query-string';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DecodedValueMap,
  QueryParamConfigMap,
  encodeQueryParams,
  useQueryParams,
} from 'use-query-params';
import type { GlobalQueryParams } from '../routes';

type WithGlobalParams<T extends QueryParamConfigMap> = GlobalQueryParams & T;

export type RouteConfig<T extends QueryParamConfigMap> = {
  path: string;
  queryParams: T;
};

export type RouteURL = { go: () => void; href: string };

export function isRouteURL(url: RouteURL | string): url is RouteURL {
  return (url as RouteURL).href !== undefined;
}

type RouteContext<T extends QueryParamConfigMap> = {
  getURL: (newParams: Partial<DecodedValueMap<T>>) => RouteURL;
  isPage: boolean;
  params: DecodedValueMap<WithGlobalParams<T>>;
};

type UseRouteContext<T extends QueryParamConfigMap> = () => RouteContext<T>;

export type Route<T extends QueryParamConfigMap> = RouteConfig<
  WithGlobalParams<T>
> & {
  useRouteContext: UseRouteContext<T>;
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

export function buildUseRouteContext<T extends QueryParamConfigMap>(
  routeConfig: RouteConfig<T>,
): UseRouteContext<T> {
  return function useRouteContext(): RouteContext<T> {
    const [params] = useQueryParams<T>(routeConfig.queryParams);
    const { pathname } = useLocation();
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
        isPage: pathname.startsWith(routeConfig.path),
        params,
      }),
      [getURL, params, pathname],
    );
  };
}
