const ButtonLayoutProps = {
  alignItems: 'center',
  borderRadius: 'md',
  display: 'inline-flex',
  fontWeight: 'semibold',
  h: 12,
  px: 4,
  py: 2,
};

export const PrimaryButton = {
  ...ButtonLayoutProps,
  _hover: {
    bg: 'cyan.500',
    textDecor: 'none',
  },
  bg: 'cyan.400',
  color: 'gray.50',
};

export const SecondaryButton = {
  ...ButtonLayoutProps,
  _hover: {
    bg: 'gray.200',
    textDecor: 'none',
  },
  bg: 'gray.100',
};
