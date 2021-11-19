import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './app/hooks';
import Body from './components/Body';
import Footer from './components/Footer';
import HamburgerMenu from './components/HamburgerMenu';
import Header from './components/Header';
import TossupHistoryModal from './components/TossupHistoryModal';
import { reset } from './FrequencyList/frequencyListSlice';
import SettingsModal from './Settings';
import { selectQuestionSettings } from './Settings/settingsSlice';

const App: React.FC = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTossupHistoryModalOpen, setIsTossupHistoryModalOpen] =
    useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const questionSettings = useSelector(selectQuestionSettings);
  const dispatch = useAppDispatch();

  // if question settings change, reset freq to initial state
  useEffect(() => {
    dispatch(reset());
  }, [dispatch, questionSettings]);

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
