import { useCallback, useMemo } from 'react';

import { filterBonusesWithRefetch } from '../BonusReader/bonusReaderSlice';
import { reset } from '../FrequencyList/frequencyListSlice';
import { useAppDispatch } from '../redux/utils';
import { useGlobalQueryParams } from '../routes';
import { filterTossupsWithRefetch } from '../TossupReader/tossupReaderSlice';
import { restoreSettings, saveSettings } from '../utils/settings/storage';
import { Settings } from '../utils/settings/types';
import {
  getUpdatedCategoriesFromSubcategories,
  getUpdatedSubcategoriesFromCategories,
  getURLQueryParamSettings,
} from '../utils/settings/validate';

type SettingsHook = {
  setSettings: (newSettings: Partial<Settings>) => void;
  settings: Settings;
};

export const useSettings = (): SettingsHook => {
  const [params, setParams] = useGlobalQueryParams();
  const dispatch = useAppDispatch();

  // always read reading speed from local storage
  const { readingSpeed } = restoreSettings();
  const settings = useMemo<Settings>(
    () => ({
      categories: params.categories,
      difficulties: params.difficulties,
      fromYear: params.fromYear,
      readingSpeed,
      subcategories: params.subcategories,
      tournaments: params.tournaments,
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
        dispatch(filterTossupsWithRefetch({ settings: nextSettings }));
        dispatch(filterBonusesWithRefetch({ settings: nextSettings }));

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

  return useMemo(() => ({ setSettings, settings }), [setSettings, settings]);
};
