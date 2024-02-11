import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

// Navigate wrapper for passing query params
export default function RedirectToTossupReader() {
  const { getURL } = ROUTES.tossupReader.useRouteContext();

  return <Navigate to={getURL({}).href} />;
}
