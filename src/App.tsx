import { Flex } from '@chakra-ui/react';

import Header from './components/Header';
import Body from './components/Body';

const App: React.FC = () => {
  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Body />
    </Flex>
  );
};

export default App;
