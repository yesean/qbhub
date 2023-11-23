import { useEffect, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';
import { restoreSettings } from '../utils/settings/storage';
import {
  getValidatedSettings,
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
    const initialSettings = getValidatedSettings(
      // if url is empty, fallback to local storage
      isQueryParamsEmpty ? initialStorageSettings : initialURLSettings,
    );

    setSettings(initialSettings);
  }, [setSettings]);

  return children;
};
