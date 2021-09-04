import { Center } from '@chakra-ui/react';

import TossupReader from '../TossupReader';

type BodyProps = {};

const Body: React.FC<BodyProps> = () => {
  return (
    <Center flexGrow={1} p={4} overflow="auto">
      <TossupReader />
    </Center>
  );
};

export default Body;
