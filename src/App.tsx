import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import Body from './components/Body';
import Footer from './components/Footer';
import HamburgerMenu from './components/HamburgerMenu';
import Header from './components/Header';
import { open as openInfo } from './components/InfoModal/infoModalSlice';
import TossupHistoryModal from './components/TossupHistoryModal';
import { reset } from './FrequencyList/frequencyListSlice';
import { useKeyboardShortcut } from './hooks/keyboard';
import SettingsModal from './Settings';
import {
  close,
  open as openSettings,
  selectQuestionSettings,
  selectSettings,
} from './Settings/settingsSlice';
import { ROUTES } from './utils/routes';

const App: React.FC = () => {
  const [isTossupHistoryModalOpen, setIsTossupHistoryModalOpen] =
    useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const { isOpen } = useSelector(selectSettings);
  const questionSettings = useSelector(selectQuestionSettings);
  const dispatch = useAppDispatch();
  const history = useHistory();

  // if question settings change, reset freq to initial state
  useEffect(() => {
    dispatch(reset());
  }, [dispatch, questionSettings]);

  const predicate = (e: KeyboardEvent) => e.target === document.body;
  useKeyboardShortcut('1', () => history.push(ROUTES.tossupReader), predicate);
  useKeyboardShortcut('2', () => history.push(ROUTES.freq), predicate);
  useKeyboardShortcut('3', () => history.push(ROUTES.cluesSearch), predicate);
  useKeyboardShortcut('?', () => dispatch(openInfo()), predicate);

  return (
    <>
      <Flex direction="column" h="100vh">
        <Header
          onClickHistoryIcon={() => setIsTossupHistoryModalOpen(true)}
          onClickSettingsIcon={() => dispatch(openSettings())}
          onClickMenuIcon={() => setIsHamburgerMenuOpen(true)}
        />
        <Body />
        <Footer />
      </Flex>
      <TossupHistoryModal
        isOpen={isTossupHistoryModalOpen}
        onClose={() => setIsTossupHistoryModalOpen(false)}
      />
      <SettingsModal isOpen={isOpen} onClose={() => dispatch(close())} />
      <HamburgerMenu
        isOpen={isHamburgerMenuOpen}
        onClose={() => setIsHamburgerMenuOpen(false)}
      />
    </>
  );
};

export default App;
