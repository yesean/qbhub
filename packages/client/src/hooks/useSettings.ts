import { useCallback, useMemo } from 'react';
import { filterBonuses } from '../BonusReader/bonusReaderSlice';
import { useAppDispatch } from '../redux/hooks';
import { filterTossups } from '../TossupReader/tossupReaderSlice';
import { useGlobalQueryParams } from '../utils/routes';
import { saveSettings, Settings } from '../utils/settings';

type SettingsHook = {
  settings: Settings;
  setSettings: (newSettings: Partial<Settings>) => void;
};

export const useSettings = (): SettingsHook => {
  const [params, setParams] = useGlobalQueryParams();
  const dispatch = useAppDispatch();

  const settings = useMemo<Settings>(
    () => ({
      categories: params.categories,
      subcategories: params.subcategories,
      difficulties: params.difficulties,
      tournaments: params.tournaments,
      fromYear: params.fromYear,
      readingSpeed: params.readingSpeed,
    }),
    [
      params.categories,
      params.difficulties,
      params.fromYear,
      params.readingSpeed,
      params.subcategories,
      params.tournaments,
    ],
  );

  const setSettings = useCallback(
    (settingsUpdate: Partial<Settings>) => {
      const newSettings = { ...settings, ...settingsUpdate };
      setParams(settingsUpdate);

      // update questions
      dispatch(filterTossups(newSettings));
      dispatch(filterBonuses(newSettings));

      // save settings to local storage
      saveSettings(newSettings);
    },
    [dispatch, setParams, settings],
  );

  return useMemo(() => ({ settings, setSettings }), [setSettings, settings]);
};
