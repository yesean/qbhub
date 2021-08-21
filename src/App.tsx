import { useState } from 'react';
import { Flex } from '@chakra-ui/react';

import Header from './components/Header';
import Body from './components/Body';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <>
      <Flex direction="column" h="100vh">
        <Header onClickSettingsIcon={() => setIsSettingsModalOpen(true)} />
        <Body />
      </Flex>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
};

export default App;
