import { Navigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { getTossupReaderURL } from '../utils/routes';

// Navigate wrapper for passing query params
export default function NavigateToTossupReader() {
  const { settings } = useSettings();

  return <Navigate to={getTossupReaderURL(settings)} />;
}
