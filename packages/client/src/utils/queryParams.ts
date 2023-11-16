import { buildIsEnum, isNumber } from '@qbhub/types';
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

const buildRangedNumberParam = <T extends typeof NumberParam>(
  param: T,
  minimumValue: number,
  maximumValue: number,
) => ({
  encode(arg: Parameters<typeof param.encode>[0]) {
    if (isNumber(arg) && (arg < minimumValue || arg > maximumValue)) {
      return undefined;
    }

    return param.encode(arg);
  },
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);
    if (decodedValue == null) return undefined;

    if (decodedValue < minimumValue || decodedValue > maximumValue)
      return undefined;

    return decodedValue;
  },
});

const buildSkipEncodeNumberParam = <T extends typeof NumberParam>(
  param: T,
  skipValue: number,
) => ({
  encode(arg: Parameters<typeof param.encode>[0]) {
    if (isNumber(arg) && arg === skipValue) return undefined;

    return param.encode(arg);
  },
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);

    if (decodedValue == null) return undefined;
    if (decodedValue === skipValue) return undefined;

    return decodedValue;
  },
});

const buildNeverNullParam = <T extends QueryParamConfig<U, V>, U, V>(
  param: T,
) => ({
  encode(...args: Parameters<typeof param.encode>) {
    const encodedValue = param.encode(...args);
    if (encodedValue == null) return undefined;

    return encodedValue;
  },
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);
    if (decodedValue == null) return undefined;

    return decodedValue;
  },
});

export const buildNeverNullRangedNumberParamWithSkip = (
  minimumValue: number,
  maximumValue: number,
  skipValue: number,
) =>
  buildNeverNullParam<
    typeof NumberParam,
    Parameters<typeof NumberParam.encode>[0],
    ReturnType<typeof NumberParam.decode>
  >(
    buildRangedNumberParam(
      buildSkipEncodeNumberParam(NumberParam, skipValue),
      minimumValue,
      maximumValue,
    ),
  );

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
