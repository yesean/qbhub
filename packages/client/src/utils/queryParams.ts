import { buildIsEnum, isNumber } from '@qbhub/types';
import {
  NumberParam,
  QueryParamConfig,
  StringParam,
  decodeDelimitedNumericArray,
  encodeDelimitedNumericArray,
} from 'use-query-params';

type NumericEnum<T extends string, U extends number> = { [key in T]: U };

export const buildNumericEnumArrayParam = <T extends string, U extends number>(
  numericEnum: NumericEnum<T, U>,
) => {
  const isEnum = buildIsEnum(numericEnum);

  return {
    decode(...args: Parameters<typeof decodeDelimitedNumericArray>): U[] {
      const numericArray = decodeDelimitedNumericArray(...args);
      if (numericArray == null) return [];

      return numericArray.filter(isEnum);
    },
    encode(...args: Parameters<typeof encodeDelimitedNumericArray>) {
      const array = args[0];
      if (Array.isArray(array) && array.length === 0) return undefined;

      return encodeDelimitedNumericArray(...args);
    },
  };
};

const buildRangedNumberParam = <T extends typeof NumberParam>(
  param: T,
  minimumValue: number,
  maximumValue: number,
) => ({
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);
    if (decodedValue == null) return undefined;

    if (decodedValue < minimumValue || decodedValue > maximumValue)
      return undefined;

    return decodedValue;
  },
  encode(arg: Parameters<typeof param.encode>[0]) {
    if (isNumber(arg) && (arg < minimumValue || arg > maximumValue)) {
      return undefined;
    }

    return param.encode(arg);
  },
});

const buildSkipEncodeNumberParam = <T extends typeof NumberParam>(
  param: T,
  skipValue: number,
) => ({
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);

    if (decodedValue == null) return undefined;
    if (decodedValue === skipValue) return undefined;

    return decodedValue;
  },
  encode(arg: Parameters<typeof param.encode>[0]) {
    if (isNumber(arg) && arg === skipValue) return undefined;

    return param.encode(arg);
  },
});

const buildNeverNullParam = <T>(
  param: QueryParamConfig<T | null | undefined>,
): QueryParamConfig<T | undefined> => ({
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);
    if (decodedValue == null) return undefined;

    return decodedValue;
  },
  encode(...args: Parameters<typeof param.encode>) {
    const encodedValue = param.encode(...args);
    if (encodedValue == null) return undefined;

    return encodedValue;
  },
});

const buildNeverUndefinedStringParam = (
  param: QueryParamConfig<string | undefined>,
): QueryParamConfig<string> => ({
  ...param,
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);
    if (decodedValue === undefined) return '';

    return decodedValue;
  },
});

const buildNeverUndefinedNumberParam = (
  param: QueryParamConfig<number | undefined>,
): QueryParamConfig<number> => ({
  ...param,
  decode(...args: Parameters<typeof param.decode>) {
    const decodedValue = param.decode(...args);
    if (decodedValue === undefined) return 0;

    return decodedValue;
  },
});

export const buildNeverNullRangedNumberParamWithSkip = (
  minimumValue: number,
  maximumValue: number,
  skipValue: number,
) =>
  buildNeverNullParam(
    buildRangedNumberParam(
      buildSkipEncodeNumberParam(NumberParam, skipValue),
      minimumValue,
      maximumValue,
    ),
  );

export const NeverNullNumberParam = buildNeverNullParam(NumberParam);
export const NeverNullStringParam = buildNeverNullParam(StringParam);
export const NeverNullOrUndefinedNumberParam =
  buildNeverUndefinedNumberParam(NeverNullNumberParam);
export const NeverNullOrUndefinedStringParam =
  buildNeverUndefinedStringParam(NeverNullStringParam);
