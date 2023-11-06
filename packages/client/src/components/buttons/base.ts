const ButtonLayoutProps = {
  display: 'inline-flex',
  alignItems: 'center',
  h: 12,
  px: 4,
  py: 2,
  borderRadius: 'md',
  fontWeight: 'semibold',
};

export const PrimaryButton = {
  ...ButtonLayoutProps,
  bg: 'cyan.400',
  color: 'gray.50',
  _hover: {
    textDecor: 'none',
    bg: 'cyan.500',
  },
};

export const SecondaryButton = {
  ...ButtonLayoutProps,
  bg: 'gray.100',
  _hover: {
    textDecor: 'none',
    bg: 'gray.200',
  },
};
