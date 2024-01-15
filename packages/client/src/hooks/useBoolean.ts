import { useCallback, useMemo, useState } from 'react';

export default function useBoolean(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);

  const setFalse = useCallback(() => setValue(false), []);
  const setTrue = useCallback(() => setValue(true), []);
  const toggleValue = useCallback(
    (prevValue: boolean) => setValue(!prevValue),
    [],
  );

  return useMemo(
    () => ({
      setFalse,
      setTrue,
      toggleValue,
      value,
    }),
    [setFalse, setTrue, toggleValue, value],
  );
}
