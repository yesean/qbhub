/**
 * Build an object from an array, using array elements as the key and a callback for the value
 */
export function objectPull<TItem extends number | string, TValue>(
  items: TItem[],
  valueMapping: (item: TItem) => TValue,
): Record<TItem, TValue> {
  return items.reduce(
    (acc, element) => ({
      ...acc,
      [element]: valueMapping(element),
    }),
    {} as Record<TItem, TValue>,
  );
}

/**
 * Build an object from an array, using callbacks for the key and value
 */
export function objectPullWithKey<TItem, TValue, TKey extends number | string>(
  items: TItem[],
  valueMapping: (item: TItem) => TValue,
  keyMapping: (item: TItem) => TKey,
): Record<TKey, TValue> {
  return items.reduce(
    (acc, element) => ({
      ...acc,
      [keyMapping(element)]: valueMapping(element),
    }),
    {} as Record<TKey, TValue>,
  );
}
