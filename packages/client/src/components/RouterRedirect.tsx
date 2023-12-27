import { Navigate, NavigateProps } from 'react-router-dom';
import { RouteURL, isRouteURL } from '../utils/routes';

type RouterRedirectProps = Omit<NavigateProps, 'to'> & {
  to: RouteURL | string;
};

export default function RouterRedirect({ to, ...rest }: RouterRedirectProps) {
  const href = isRouteURL(to) ? to.href : to;

  return <Navigate to={href} {...rest} />;
}
