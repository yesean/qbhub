import { useEffect, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';
import { restoreSettings } from '../utils/settings/storage';
import {
  getUpdatedCategoriesFromSubcategories,
  isSettingsDefault,
} from '../utils/settings/validate';

const initialStorageSettings = restoreSettings();

type Props = {
  children: React.ReactElement;
};

// Provider component for initializing settings
export default ({ children }: Props) => {
  const { settings, setSettings } = useSettings();
  const ref = useRef(settings); // initialize ref at mount

  // only run once at mount
  useEffect(() => {
    const initialURLSettings = ref.current;
    const isQueryParamsEmpty = isSettingsDefault(initialURLSettings);

    // if url is empty, try restoring settings from local storage
    if (isQueryParamsEmpty) {
      setSettings(initialStorageSettings);
    } else {
      // if categories and subcategories conflict, give priority to subcategories
      const updatedCategories = getUpdatedCategoriesFromSubcategories(
        initialURLSettings.categories,
        initialURLSettings.subcategories,
      );
      setSettings({ ...initialURLSettings, categories: updatedCategories }); // save url settings to local storage
    }
  }, [setSettings]);

  return children;
};
