import { ComponentProps } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { isRouteURL, type RouteURL } from '../../utils/routes';
import { LinkButton, Props as LinkButtonProps } from './LinkButton';

type RouterLinkButtonProps = LinkButtonProps &
  Omit<ComponentProps<typeof ReactRouterLink>, 'to'> & {
    to: RouteURL | string;
  };

export default function RouterLinkButton({
  to,
  ...rest
}: RouterLinkButtonProps) {
  const href = isRouteURL(to) ? to.href : to;
  return (
    <LinkButton
      as={ReactRouterLink}
      to={href}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  );
}
