import { Link, LinkProps } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BaseButtonProps } from './base';

export type RouterLinkButtonProps = LinkProps & {
  to: string;
  label: React.ReactNode;
};

const RouterLinkButton: React.FC<RouterLinkButtonProps> = ({
  to,
  label,
  ...rest
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Link {...BaseButtonProps} as={RouterLink} to={to} {...rest}>
    {label}
  </Link>
);

export default RouterLinkButton;
