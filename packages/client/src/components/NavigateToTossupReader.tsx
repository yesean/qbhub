import { Navigate } from 'react-router-dom';
import { getTossupReaderURL, useGlobalQueryParams } from '../utils/routes';

// Navigate wrapper for passing query params
export default function NavigateToTossupReader() {
  const [params] = useGlobalQueryParams();

  return <Navigate to={getTossupReaderURL(params)} />;
}
