import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import Body from './components/Body';
import Footer from './components/Footer';
import HamburgerMenu from './components/HamburgerMenu';
import Header from './components/Header';
import TossupHistoryModal from './components/TossupHistoryModal';
import SettingsModal from './Settings';

const App: React.FC = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTossupHistoryModalOpen, setIsTossupHistoryModalOpen] =
    useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  return (
    <>
      <Flex direction="column" h="100vh">
        <Header
          onClickHistoryIcon={() => setIsTossupHistoryModalOpen(true)}
          onClickSettingsIcon={() => setIsSettingsModalOpen(true)}
          onClickMenuIcon={() => setIsHamburgerMenuOpen(true)}
        />
        <Body />
        <Footer />
      </Flex>
      <TossupHistoryModal
        isOpen={isTossupHistoryModalOpen}
        onClose={() => setIsTossupHistoryModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <HamburgerMenu
        isOpen={isHamburgerMenuOpen}
        onClose={() => setIsHamburgerMenuOpen(false)}
      />
    </>
  );
};

export default App;
