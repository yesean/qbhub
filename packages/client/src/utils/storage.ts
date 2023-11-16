// save item to local storage
export const save = (key: string, data: unknown) =>
  window.localStorage.setItem(key, JSON.stringify(data));

// restore item from local storage with error handling and optional validation
export const restore = <T>(
  key: string,
  isDataValid: (data: any) => data is T = (data): data is T => true,
): T | undefined => {
  const data = window.localStorage.getItem(key);

  if (data == null) {
    return undefined;
  }

  try {
    const parsedData = JSON.parse(data);

    if (!isDataValid(parsedData)) {
      throw new Error('invalid data');
    }

    return parsedData;
  } catch (e) {
    // if data is malformed, remove from localStorage
    window.localStorage.removeItem(key);
    return undefined;
  }
};
