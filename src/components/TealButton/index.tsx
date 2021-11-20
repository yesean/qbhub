import { Button, ButtonProps } from '@chakra-ui/react';

const TealButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button colorScheme="cyan" color="gray.50" {...props}>
      {children}
    </Button>
  );
};

export default TealButton;
