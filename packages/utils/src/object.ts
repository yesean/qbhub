type KeyType = number | string | symbol;

/**
 * Build an object from an array, using array elements as the key and a callback for the value
 */
export function objectPull<TItem extends KeyType, TValue>(
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
export function objectPullWithKey<TItem, TValue, TKey extends KeyType>(
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

/**
 * Group elements from an array, using a callback for the key
 */
export function objectGroupBy<TItem, TKey extends KeyType>(
  items: TItem[],
  keyMapping: (item: TItem) => TKey,
): Record<TKey, TItem[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyMapping(item);
      const prevValue = acc[key] ?? [];
      return { ...acc, [key]: [...prevValue, item] };
    },
    {} as Record<TKey, TItem[]>,
  );
}

/**
 * Return a new object, with new values mapped by a callback
 */
export function objectMap<TKey extends KeyType, TValue, TNewValue>(
  object: Record<TKey, TValue>,
  valueMapping: (item: TValue) => TNewValue,
) {
  return (Object.entries(object) as Array<[TKey, TValue]>).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: valueMapping(value) }),
    {} as Record<TKey, TNewValue>,
  );
}
