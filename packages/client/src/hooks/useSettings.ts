import { useCallback, useMemo } from 'react';
import { filterBonuses } from '../BonusReader/bonusReaderSlice';
import { reset } from '../FrequencyList/frequencyListSlice';
import { filterTossups } from '../TossupReader/tossupReaderSlice';
import { useAppDispatch } from '../redux/hooks';
import { useGlobalQueryParams } from '../utils/routes';
import { restoreSettings, saveSettings } from '../utils/settings/storage';
import { Settings } from '../utils/settings/types';
import {
  getURLQueryParamSettings,
  getUpdatedCategoriesFromSubcategories,
  getUpdatedSubcategoriesFromCategories,
} from '../utils/settings/validate';

type SettingsHook = {
  settings: Settings;
  setSettings: (newSettings: Partial<Settings>) => void;
};

export const useSettings = (): SettingsHook => {
  const [params, setParams] = useGlobalQueryParams();
  const dispatch = useAppDispatch();

  // always read reading speed from local storage
  const { readingSpeed } = restoreSettings();
  const settings = useMemo<Settings>(
    () => ({
      categories: params.categories,
      subcategories: params.subcategories,
      difficulties: params.difficulties,
      tournaments: params.tournaments,
      fromYear: params.fromYear,
      readingSpeed,
    }),
    [
      params.categories,
      params.difficulties,
      params.fromYear,
      params.subcategories,
      params.tournaments,
      readingSpeed,
    ],
  );

  const setSettings = useCallback(
    (update: Partial<Settings>) => {
      setParams((prevSettings) => {
        const nextSettings = { ...prevSettings, ...update };

        // update subcategories if needed
        if (update.categories != null)
          nextSettings.subcategories = getUpdatedSubcategoriesFromCategories(
            nextSettings.subcategories,
            update.categories,
          );

        // update categories if needed
        if (update.subcategories != null)
          nextSettings.categories = getUpdatedCategoriesFromSubcategories(
            nextSettings.categories,
            update.subcategories,
          );

        // update questions
        dispatch(filterTossups(nextSettings));
        dispatch(filterBonuses(nextSettings));

        // reset frequency list if question params change
        if (
          update.categories != null ||
          update.subcategories != null ||
          update.difficulties != null ||
          update.tournaments != null ||
          update.fromYear != null
        )
          dispatch(reset());

        // save settings to local storage
        saveSettings(nextSettings);

        // update url
        const urlQueryParamSettings = getURLQueryParamSettings(nextSettings);
        return urlQueryParamSettings;
      });
    },
    [dispatch, setParams],
  );

  return useMemo(() => ({ settings, setSettings }), [setSettings, settings]);
};
