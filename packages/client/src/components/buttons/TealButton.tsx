import { Button, ButtonProps } from '@chakra-ui/react';

const TealButton: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  ...props
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Button color="gray.50" colorScheme="cyan" {...props}>
    {children}
  </Button>
);

export default TealButton;
