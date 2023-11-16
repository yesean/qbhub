import { buildIsEnum } from '@qbhub/types';
import {
  decodeDelimitedNumericArray,
  encodeDelimitedNumericArray,
  NumberParam,
  QueryParamConfig,
  StringParam,
} from 'use-query-params';

type NumericEnum<T extends string, U extends number> = { [key in T]: U };

export const buildNumericEnumArrayParam = <T extends string, U extends number>(
  numericEnum: NumericEnum<T, U>,
) => {
  const isEnum = buildIsEnum(numericEnum);

  return {
    encode(...args: Parameters<typeof encodeDelimitedNumericArray>) {
      const array = args[0];
      if (Array.isArray(array) && array.length === 0) return undefined;

      return encodeDelimitedNumericArray(...args);
    },
    decode(...args: Parameters<typeof decodeDelimitedNumericArray>): U[] {
      const numericArray = decodeDelimitedNumericArray(...args);
      if (numericArray == null) return [];

      return numericArray.filter(isEnum);
    },
  };
};

export const buildNeverNullParam = <T extends QueryParamConfig<U, V>, U, V>(
  param: T,
) => ({
  ...param,
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);
    if (decodedValue == null) return undefined;

    return decodedValue;
  },
});

export const NeverNullNumberParam = buildNeverNullParam<
  typeof NumberParam,
  Parameters<typeof NumberParam.encode>[0],
  ReturnType<typeof NumberParam.decode>
>(NumberParam);

export const NeverNullStringParam = buildNeverNullParam<
  typeof StringParam,
  Parameters<typeof StringParam.encode>[0],
  ReturnType<typeof StringParam.decode>
>(StringParam);
