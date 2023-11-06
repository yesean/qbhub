import { Box, Link as ChakraLink, ThemingProps } from '@chakra-ui/react';
import { PrimaryButton, SecondaryButton } from './base';

export type Props<T extends React.ComponentType = typeof ChakraLink> =
  React.ComponentProps<T> &
    ThemingProps<'Link'> & {
      label: React.ReactNode;
      leftIcon?: React.ReactElement;
      variant?: 'primary' | 'secondary';
    };

export const LinkButton = ({
  label,
  leftIcon,
  variant = 'primary',
  ...rest
}: Props) => (
  <ChakraLink
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...(variant === 'primary' ? PrimaryButton : SecondaryButton)}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  >
    {leftIcon != null ? <Box mr={2}>{leftIcon}</Box> : null}
    {label}
  </ChakraLink>
);
