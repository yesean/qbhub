/* eslint-disable react/jsx-props-no-spreading */
import { Box, Link, LinkProps } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BaseIconButtonProps } from './base';

export type RouterLinkIconButtonProps = LinkProps & {
  to: string;
  icon: React.ReactElement;
  label?: string;
};

const RouterLinkIconButton: React.FC<RouterLinkIconButtonProps> = ({
  to,
  icon,
  label = '',
  ...rest
}) => {
  const content = () => {
    if (label === '') {
      return icon;
    }

    return (
      <>
        <Box as="span" mr={1} display="inline-flex" alignItems="center">
          {icon}
        </Box>
        {label}
      </>
    );
  };

  return (
    <Link
      {...BaseIconButtonProps}
      as={RouterLink}
      to={to}
      {...rest}
      whiteSpace="pre"
    >
      {content()}
    </Link>
  );
};

export default RouterLinkIconButton;
