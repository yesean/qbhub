import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import Body from './components/Body';
import Footer from './components/Footer';
import HamburgerMenu from './components/HamburgerMenu';
import Header from './components/Header';
import InfoModal from './components/InfoModal';
import { open as openInfo } from './components/InfoModal/infoModalSlice';
import TossupHistoryModal from './components/TossupHistoryModal';
import { open as openTossupHistory } from './components/TossupHistoryModal/tossupHistoryModalSlice';
import { reset } from './FrequencyList/frequencyListSlice';
import { useKeyboardShortcut } from './hooks/keyboard';
import SettingsModal from './Settings';
import {
  open as openSettings,
  selectQuestionSettings,
} from './Settings/settingsSlice';
import { ROUTES } from './utils/routes';

const App: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const questionSettings = useSelector(selectQuestionSettings);

  // if question settings change, reset freq to initial state
  useEffect(() => {
    dispatch(reset());
  }, [dispatch, questionSettings]);

  // add global keyboard shortcuts
  const predicate = (e: KeyboardEvent) => e.target === document.body;
  useKeyboardShortcut('?', () => dispatch(openInfo()), predicate);
  useKeyboardShortcut('s', () => dispatch(openSettings()), predicate);
  useKeyboardShortcut('1', () => history.push(ROUTES.reader.tossup), predicate);
  useKeyboardShortcut('2', () => history.push(ROUTES.freq.root), predicate);
  useKeyboardShortcut('3', () => history.push(ROUTES.clues.search), predicate);
  useKeyboardShortcut('4', () => history.push(ROUTES.about.root), predicate);
  const isReaderActive = pathname.startsWith(ROUTES.reader.root);
  const customPredicate = (e: KeyboardEvent) => predicate(e) && isReaderActive;
  useKeyboardShortcut(
    'h',
    () => dispatch(openTossupHistory()),
    customPredicate,
  );

  return (
    <>
      <Flex direction="column" h="100vh">
        <Header />
        <Body />
        <Footer />
      </Flex>
      <SettingsModal />
      <InfoModal />
      <HamburgerMenu />
      <TossupHistoryModal />
    </>
  );
};

export default App;
