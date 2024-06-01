/**
 * Group elements from an array, using a callback for the key
 */
export function mapGroupBy<TItem, TKey>(
  items: TItem[],
  keyMapping: (item: TItem) => TKey,
) {
  return items.reduce((acc, item) => {
    const key = keyMapping(item);
    const prevValue = acc.get(key) ?? [];

    return acc.set(key, [...prevValue, item]);
  }, new Map<TKey, TItem[]>());
}

/**
 * Return a new map, with new values mapped by a callback
 */
export function mapMap<TKey, TValue, TNewValue>(
  map: Map<TKey, TValue>,
  valueMapping: (value: TValue) => TNewValue,
): Map<TKey, TNewValue> {
  return new Map(
    Array.from(map).map(([key, value]) => [key, valueMapping(value)]),
  );
}
