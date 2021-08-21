import { useContext } from 'react';
import { Button, Flex, Input } from '@chakra-ui/react';

import { TossupContext } from '../../../services/TossupContext';

const UserInput: React.FC = () => {
  const { refreshTossup } = useContext(TossupContext);

  return (
    <Flex>
      <Input placeholder="Answer:" mb={8} mr={4} isDisabled />
      <Button colorScheme="green" onClick={refreshTossup}>
        Next
      </Button>
    </Flex>
  );
};

export default UserInput;
