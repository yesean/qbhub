import { Center } from '@chakra-ui/react';

import TossupReader from '../TossupReader';

const Body: React.FC = () => {
  return (
    <Center flexGrow={1} p={4}>
      <TossupReader />
    </Center>
  );
};

export default Body;
