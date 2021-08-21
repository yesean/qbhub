import { Button, Flex, Input } from '@chakra-ui/react';

const UserInput: React.FC = () => {
  return (
    <Flex>
      <Input placeholder="Answer:" mb={8} mr={4} />
      <Button colorScheme="green">Buzz</Button>
    </Flex>
  );
};

export default UserInput;
