export const save = (key: string, data: any) =>
  window.localStorage.setItem(key, JSON.stringify(data));

/*
 * Factory function for saving localStorage items.
 */
export const buildSave =
  <T>(key: string) =>
  (data: T) =>
    save(key, data);

export const restore = (key: string) => window.localStorage.getItem(key);

/*
 * Factory function for restoring localStorage items with fallback behavior and
 * validation.
 */
export const buildRestore =
  <T>(key: string, defaultValue: T, validate = (_: string) => true) =>
  () => {
    const data = restore(key);

    // load default
    if (data == null || !validate(data)) {
      save(key, defaultValue);
      return defaultValue;
    }

    return JSON.parse(data) as T;
  };
