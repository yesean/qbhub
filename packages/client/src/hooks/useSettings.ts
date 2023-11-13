import { useCallback, useMemo } from 'react';
import { useGlobalQueryParams } from '../utils/routes';
import { saveSettings, Settings } from '../utils/settings';

export const useSettings = () => {
  const [params, setParams] = useGlobalQueryParams();

  const setSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      // save settings to local storage
      saveSettings(newSettings);

      setParams(newSettings);
    },
    [setParams],
  );

  return useMemo(
    () => ({ settings: params, setSettings }),
    [params, setSettings],
  );
};
