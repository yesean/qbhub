import { Link as ChakraLink } from '@chakra-ui/react';
import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from 'react-router-dom';
import { RouteURL, isRouteURL } from '../utils/routes';

type RouterLinkProps = Omit<ReactRouterLinkProps, 'to'> & {
  children: React.ReactNode;
  to: RouteURL | string;
};

export function RouterLink({ children, to }: RouterLinkProps) {
  const href = isRouteURL(to) ? to.href : to;
  return (
    <ChakraLink as={ReactRouterLink} to={href}>
      {children}
    </ChakraLink>
  );
}
