import {
  decodeNumericArray,
  encodeNumericArray,
  NumberParam,
  QueryParamConfig,
  StringParam,
} from 'use-query-params';

type NumericEnum<T extends string, U extends number> = { [key in T]: U };

export const buildNumericEnumArrayParam = <T extends string, U extends number>(
  numericEnum: NumericEnum<T, U>,
) => ({
  encode(array: Parameters<typeof encodeNumericArray>[0]) {
    return encodeNumericArray(array);
  },
  decode(arrayStr: Parameters<typeof decodeNumericArray>[0]): U[] | undefined {
    const numericArray = decodeNumericArray(arrayStr);
    if (numericArray == null) return undefined;

    const validatedArray = numericArray
      .filter((num): num is number => num != null)
      .filter((num): num is U => Object.values(numericEnum).includes(num));

    return validatedArray.length === 0 ? undefined : validatedArray;
  },
});

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
